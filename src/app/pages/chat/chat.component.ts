import { Component, OnInit, signal, inject, ElementRef, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EnviarPerguntaUseCase } from '../../application/use-cases/enviar-pergunta.usecase';
import { Mensagem, Referencia, Pergunta, CriarNivelObjeto } from '../../domain/models/mensagem.model';
import { ServicoArmazenamento } from '../../infrastructure/services/storage.service';
import { ServicoUIFeedback } from '../../infrastructure/services/ui-feedback.service';
import { ServicoClipboardCompartilhar } from '../../infrastructure/services/clipboard-share.service';
import { ReferenciaStaticRepository } from '../../infrastructure/repositories/referencia-static.repository';

interface MensagemUI extends Mensagem { parcial?: boolean }
import { marked } from 'marked';
import DOMPurify from 'dompurify';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatComponent implements OnInit {
  @ViewChild('chatArea') chatArea!: ElementRef<HTMLDivElement>;
  @ViewChild('inputPergunta') inputPergunta!: ElementRef<HTMLInputElement>;
  
  readonly mensagens = signal<MensagemUI[]>([]);
  novaPergunta = '';
  readonly enviando = signal(false);
  readonly contadorPerguntas = signal(10);
  readonly nivelConversacao = signal<'basico' | 'intermediario' | 'avancado'>('basico');
  
  private readonly enviarPerguntaUC = inject(EnviarPerguntaUseCase);
  private readonly armazenamento = inject(ServicoArmazenamento);
  private readonly ui = inject(ServicoUIFeedback);
  private readonly clipboard = inject(ServicoClipboardCompartilhar);
  private readonly referenciasRepo = inject(ReferenciaStaticRepository);
  
  private static readonly CHAVE_MENSAGENS = 'veritas-dei-mensagens';
  private static readonly CHAVE_CONTADOR = 'veritas-dei-contador';
  private static readonly CHAVE_NIVEL = 'veritas-dei-nivel';
  
  private static readonly MENSAGEM_INICIAL_IA = 'Paz e bem! Sou Veritas Dei, seu assistente católico. Como posso ajudá-lo em sua jornada de fé hoje?';
  private static readonly MENSAGEM_ERRO_PADRAO = 'Desculpe, ocorreu um erro ao processar sua pergunta. Tente novamente.';
  private static readonly MENSAGEM_ERRO_EXTRACAO = 'Desculpe, ocorreu um erro ao processar sua resposta. Tente novamente.';

  ngOnInit(): void {
    this.carregarEstadoInicial();
  }
  
  ngAfterViewInit(): void {
    this.rolarParaBaixo();
  }

  private carregarEstadoInicial(): void {
    this.carregarContador();
    this.carregarMensagens();
    this.carregarNivel();
  }

  private carregarContador(): void {
    const contadorSalvo = this.armazenamento.obter<number | string>(ChatComponent.CHAVE_CONTADOR, null);
    if (contadorSalvo != null) {
      const valor = typeof contadorSalvo === 'string' ? parseInt(contadorSalvo, 10) : contadorSalvo;
      if (Number.isFinite(valor as number)) this.contadorPerguntas.set(valor as number);
    }
  }

  private carregarMensagens(): void {
    const mensagensSalvas = this.armazenamento.obter<any[]>(ChatComponent.CHAVE_MENSAGENS, []);
    if (mensagensSalvas && mensagensSalvas.length) {
      try {
        const mensagens = mensagensSalvas;
        const normalizadas: MensagemUI[] = (Array.isArray(mensagens) ? mensagens : []).map((m: any) => ({
          mensagem: String(m?.mensagem ?? ''),
          referencias: Array.isArray(m?.referencias) ? m.referencias : undefined,
          autor: m?.autor === 'usuario' ? 'usuario' : 'ia',
          dataHora: m?.dataHora ? new Date(m.dataHora) : new Date()
        }));
        this.mensagens.set(normalizadas);
      } catch (error) {
        this.criarMensagemInicial();
      }
    } else {
      this.criarMensagemInicial();
    }
  }

  private carregarNivel(): void {
    const salvo = this.armazenamento.obter<string>(ChatComponent.CHAVE_NIVEL, null);
    if (salvo === 'basico' || salvo === 'intermediario' || salvo === 'avancado') {
      this.nivelConversacao.set(salvo);
    }
  }

  async enviarMensagem(): Promise<void> {
    if (!this.novaPergunta.trim() || this.enviando()) {
      return;
    }

    if (this.contadorPerguntas() <= 0) {
      this.mostrarModalPerguntasEsgotadas();
      return;
    }

    const perguntaTexto = this.novaPergunta.trim();
    this.limparInput();
    this.definirEstadoEnviando(true);
    this.adicionarMensagemUsuario(perguntaTexto);

    const perguntaIA: Pergunta = {
      pergunta: perguntaTexto,
      nivelConversacao: CriarNivelObjeto(this.nivelConversacao()),
      linksConfiaveis: this.referenciasRepo.obterTodas()
    };

    this.adicionarMensagemParcialIA('');
    const sub = this.enviarPerguntaUC.executarStreaming(perguntaIA).subscribe({
      next: (chunk) => {
        this.atualizarMensagemParcialIA(chunk);
      },
      error: (error) => {
        this.processarErroNaResposta(error);
        this.finalizarEnvio();
        sub.unsubscribe();
      },
      complete: () => {
        const conteudoFinal = this.enviarPerguntaUC.streamingResposta();
        const respostaFinal = {
          resposta: conteudoFinal,
          referencias: [],
          fontesConsultadas: []
        } as any;
        this.processarRespostaDaIA(respostaFinal);
        this.finalizarEnvio();
        sub.unsubscribe();
      }
    });
  }

  private adicionarMensagemParcialIA(conteudo: string): void {
    const mensagemParcial: MensagemUI = {
      mensagem: conteudo,
      dataHora: new Date(),
      autor: 'ia',
      parcial: true
    };
    this.mensagens.update(msgs => [...msgs, mensagemParcial]);
    this.rolarParaBaixo();
  }

  private atualizarMensagemParcialIA(chunk: string): void {
    this.mensagens.update(msgs => {
      const ultima = msgs[msgs.length - 1] as MensagemUI | undefined;
      if (ultima && ultima.autor === 'ia' && ultima.parcial) {
        ultima.mensagem += chunk;
      }
      return [...msgs];
    });
    this.rolarParaBaixo();
  }

  ehString(ref: string | Referencia): ref is string {
    return typeof ref === 'string';
  }

  trackByTimestamp(index: number, mensagem: Mensagem): number {
    return mensagem.dataHora.getTime();
  }

  formatarConteudo(conteudo: string): string {
    const html = marked.parse(conteudo ?? '', { breaks: true });
    const seguro = DOMPurify.sanitize(html as string, { USE_PROFILES: { html: true } });
    return seguro;
  }

  copiarMensagem(conteudo: string): void {
    this.clipboard.copiarTexto(conteudo)
      .then(() => this.ui.mostrarToast('Mensagem copiada para a área de transferência!'))
      .catch(() => this.ui.mostrarToast('Erro ao copiar mensagem', 'error'));
  }

  compartilharMensagem(conteudo: string): void {
    this.clipboard.compartilharTexto(conteudo).catch(() => {});
  }

  private criarMensagemInicial(): void {
    const mensagemInicial: MensagemUI = {
      mensagem: ChatComponent.MENSAGEM_INICIAL_IA,
      dataHora: new Date(),
      autor: 'ia'
    };
    
    this.mensagens.set([mensagemInicial]);
    this.salvarMensagens();
  }

  private limparInput(): void {
    this.novaPergunta = '';
  }

  private definirEstadoEnviando(enviando: boolean): void {
    this.enviando.set(enviando);
  }

  private adicionarMensagemUsuario(pergunta: string): void {
    const mensagemUsuario: MensagemUI = {
      mensagem: pergunta,
      dataHora: new Date(),
      autor: 'usuario'
    };
    
    this.mensagens.update(mensagens => [...mensagens, mensagemUsuario]);
    this.salvarMensagens();
  }

  private processarRespostaDaIA(resposta: any): void {
    if (!resposta) return;

    const conteudo = resposta.resposta || ChatComponent.MENSAGEM_ERRO_EXTRACAO;
    const referencias = resposta.referencias || [];
    const ehRespostaValida = this.validarResposta(conteudo);
    
    // Se a última mensagem for a parcial da IA, substitui em vez de duplicar
    this.mensagens.update(mensagens => {
      const copia = [...mensagens];
      const ultima = copia[copia.length - 1];
      if (ultima && ultima.autor === 'ia' && ultima.parcial) {
        ultima.mensagem = conteudo;
        ultima.referencias = referencias;
        delete (ultima as any).parcial;
        return copia;
      }
      const novaMensagem: MensagemUI = {
        mensagem: conteudo,
        referencias: referencias,
        dataHora: new Date(),
        autor: 'ia'
      };
      return [...copia, novaMensagem];
    });
    
    if (ehRespostaValida) {
      this.decrementarContador();
    }
    
    this.salvarMensagens();
  }

  private processarErroNaResposta(error: any): void {
    const conteudoErro = ChatComponent.MENSAGEM_ERRO_PADRAO;
    // Se houver mensagem parcial, substitui por erro; senão adiciona nova
    this.mensagens.update(mensagens => {
      const copia = [...mensagens];
      const ultima = copia[copia.length - 1];
      if (ultima && ultima.autor === 'ia' && (ultima as any).parcial) {
        ultima.mensagem = conteudoErro;
        delete (ultima as any).parcial;
        return copia;
      }
      const mensagemErro: MensagemUI = {
        mensagem: conteudoErro,
        dataHora: new Date(),
        autor: 'ia'
      };
      return [...copia, mensagemErro];
    });
    this.salvarMensagens();
  }

  private finalizarEnvio(): void {
    this.definirEstadoEnviando(false);
    this.focarInput();
  }

  private focarInput(): void {
    setTimeout(() => {
      if (this.inputPergunta) {
        this.inputPergunta.nativeElement.focus();
      }
    }, 100);
  }

  private validarResposta(conteudo: string): boolean {
    return Boolean(conteudo && conteudo !== ChatComponent.MENSAGEM_ERRO_EXTRACAO);
  }

  private decrementarContador(): void {
    this.contadorPerguntas.update(contador => Math.max(0, contador - 1));
    this.salvarContador();
  }

  private rolarParaBaixo(): void {
    if (this.chatArea) {
      this.chatArea.nativeElement.scrollTop = this.chatArea.nativeElement.scrollHeight;
    }
  }

  private salvarContador(): void {
    this.armazenamento.salvarNumero(ChatComponent.CHAVE_CONTADOR, this.contadorPerguntas());
  }

  private salvarMensagens(): void {
    const paraSalvar = this.mensagens().map(m => {
      const { mensagem, referencias, autor, dataHora } = m;
      return { mensagem, referencias, autor, dataHora } as Mensagem;
    });
    this.armazenamento.salvar(ChatComponent.CHAVE_MENSAGENS, paraSalvar);
  }

  private salvarNivel(): void {
    this.armazenamento.salvar(ChatComponent.CHAVE_NIVEL, this.nivelConversacao());
  }

  private mostrarToast(mensagem: string, tipo: 'success' | 'error' = 'success'): void {
    this.ui.mostrarToast(mensagem, tipo);
  }

  selecionarNivel(nivel: 'basico' | 'intermediario' | 'avancado'): void {
    if (this.nivelConversacao() === nivel) return;
    this.nivelConversacao.set(nivel);
    this.salvarNivel();
  }

  get streamingAtual(): string {
    return this.enviarPerguntaUC.streamingResposta();
  }

  private mostrarModalPerguntasEsgotadas(): void {
    this.ui.abrirModalPorId('modalPerguntasEsgotadas');
  }

  fecharModalPerguntasEsgotadas(): void {
    this.ui.fecharModalPorId('modalPerguntasEsgotadas');
  }

  abrirModalNiveis(): void {
    this.ui.abrirModalPorId('modalNiveisConhecimento');
  }

  fecharModalNiveis(): void {
    this.ui.fecharModalPorId('modalNiveisConhecimento');
  }

  assistirAnuncio(): void {
    window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ', '_blank');
    this.fecharModalPerguntasEsgotadas();
    this.contadorPerguntas.update(contador => contador + 5);
    this.salvarContador();
    this.mostrarToast('Você ganhou 5 perguntas!');
    this.enviarMensagem();
    this.focarInput();
  }
}