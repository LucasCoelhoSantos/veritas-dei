import { Component, OnInit, signal, inject, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { N8nGateway } from '../../gateways/n8n.gateway';
import { Mensagem, Referencia } from '../../models/mensagem.model';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html'
})
export class ChatComponent implements OnInit, AfterViewChecked {
  @ViewChild('chatArea') chatArea!: ElementRef<HTMLDivElement>;
  @ViewChild('inputPergunta') inputPergunta!: ElementRef<HTMLInputElement>;
  
  mensagens = signal<Mensagem[]>([]);
  novaPergunta = '';
  enviando = signal(false);
  contadorPerguntas = signal(100); // TO DO mudar para 10
  nivelConversacao = signal<'basico' | 'intermediario' | 'avancado'>('basico');
  
  private n8nGateway = inject(N8nGateway);
  
  private readonly CHAVE_MENSAGENS = 'veritas-dei-mensagens';
  private readonly CHAVE_CONTADOR = 'veritas-dei-contador';
  private readonly CHAVE_USUARIO_ID = 'veritas-dei-user-id';
  private readonly CHAVE_NIVEL = 'veritas-dei-nivel';
  
  private readonly MENSAGEM_INICIAL_IA = 'Paz e bem! Sou seu Veritas Dei, seu assistente católico. Como posso ajudá-lo em sua jornada de fé hoje?';
  private readonly MENSAGEM_ERRO_PADRAO = 'Desculpe, ocorreu um erro ao processar sua pergunta. Tente novamente.';
  private readonly MENSAGEM_ERRO_EXTRACAO = 'Desculpe, ocorreu um erro ao processar sua resposta. Tente novamente.';

  ngOnInit(): void {
    this.carregarEstadoInicial();
  }

  ngAfterViewChecked(): void {
    this.rolarParaBaixo();
  }

  async enviarMensagem(): Promise<void> {
    if (!this.novaPergunta.trim() || this.enviando()) {
      return;
    }

    if (this.contadorPerguntas() <= 0) {
      this.mostrarModalPerguntasEsgotadas();
      return;
    }

    const pergunta = this.novaPergunta.trim();
    this.limparInput();
    this.definirEstadoEnviando(true);

    this.adicionarMensagemUsuario(pergunta);

    try {
      const resposta = await this.obterRespostaDoN8n(pergunta);
      this.processarRespostaDoN8n(resposta);
    } catch (error) {
      this.processarErroNaResposta(error);
    } finally {
      this.finalizarEnvio();
    }
  }

  ehString(ref: string | Referencia): ref is string {
    return typeof ref === 'string';
  }

  trackByTimestamp(index: number, mensagem: Mensagem): number {
    return mensagem.timestamp.getTime();
  }

  formatarConteudo(conteudo: string): string {
    const html = marked.parse(conteudo ?? '', { breaks: true });
    const seguro = DOMPurify.sanitize(html as string, { USE_PROFILES: { html: true } });
    return seguro;
  }

  copiarMensagem(conteudo: string): void {
    const textoLimpo = this.removerTagsHtml(conteudo);
    
    if (this.temClipboardModerno()) {
      this.copiarComClipboardModerno(textoLimpo);
    } else {
      this.copiarComFallback(textoLimpo);
    }
  }

  compartilharMensagem(conteudo: string): void {
    const textoLimpo = this.removerTagsHtml(conteudo);
    
    if (this.temWebShare()) {
      this.compartilharComWebShare(textoLimpo);
    } else {
      this.compartilharComFallback(textoLimpo);
    }
  }

  private carregarEstadoInicial(): void {
    this.carregarContador();
    this.carregarMensagens();
    this.carregarNivel();
  }

  private carregarContador(): void {
    const contadorSalvo = localStorage.getItem(this.CHAVE_CONTADOR);
    if (contadorSalvo) {
      this.contadorPerguntas.set(parseInt(contadorSalvo, 10));
    }
  }

  private carregarMensagens(): void {
    const mensagensSalvas = localStorage.getItem(this.CHAVE_MENSAGENS);
    
    if (mensagensSalvas) {
      try {
        const mensagens = JSON.parse(mensagensSalvas);
        const mensagensComTimestamp = mensagens.map((m: any) => ({
          ...m,
          timestamp: new Date(m.timestamp)
        }));
        this.mensagens.set(mensagensComTimestamp);
      } catch (error) {
        console.error('Erro ao carregar mensagens do localStorage:', error);
        this.criarMensagemInicial();
      }
    } else {
      this.criarMensagemInicial();
    }
  }

  private criarMensagemInicial(): void {
    const mensagemInicial: Mensagem = {
      response: {
        message: this.MENSAGEM_INICIAL_IA,
        references: []
      },
      timestamp: new Date(),
      n8nResponse: true
    };
    
    this.mensagens.set([mensagemInicial]);
    this.salvarMensagens();
  }

  private carregarNivel(): void {
    const salvo = localStorage.getItem(this.CHAVE_NIVEL);
    if (salvo === 'basico' || salvo === 'intermediario' || salvo === 'avancado') {
      this.nivelConversacao.set(salvo);
    }
  }

  private limparInput(): void {
    this.novaPergunta = '';
  }

  private definirEstadoEnviando(enviando: boolean): void {
    this.enviando.set(enviando);
  }

  private adicionarMensagemUsuario(pergunta: string): void {
    const mensagemUsuario: Mensagem = {
      response: {
        message: pergunta,
        references: []
      },
      timestamp: new Date(),
      n8nResponse: false
    };
    
    this.mensagens.update(mensagens => [...mensagens, mensagemUsuario]);
    this.salvarMensagens();
  }

  private async obterRespostaDoN8n(pergunta: string): Promise<any> {
    return await this.n8nGateway.enviarPergunta({
      userId: this.obterUserId(),
      pergunta: pergunta,
      nivel: this.nivelConversacao()
    }).toPromise();
  }

  private processarRespostaDoN8n(resposta: any): void {
    if (!resposta) return;

    const conteudo = this.extrairConteudoResposta(resposta.output);
    const referencias = this.extrairReferencias(resposta.output);
    const ehRespostaValida = this.validarResposta(conteudo);

    const novaMensagem: Mensagem = {
      response: {
        message: conteudo,
        references: referencias
      },
      timestamp: new Date(),
      n8nResponse: true
    };

    this.mensagens.update(mensagens => [...mensagens, novaMensagem]);
    
    if (ehRespostaValida) {
      this.decrementarContador();
    }
    
    this.salvarMensagens();
  }

  private processarErroNaResposta(error: any): void {
    console.error('Erro ao enviar pergunta:', error);
    
    const mensagemErro: Mensagem = {
      response: {
        message: this.MENSAGEM_ERRO_PADRAO,
        references: []
      },
      timestamp: new Date(),
      n8nResponse: true
    };
    
    this.mensagens.update(mensagens => [...mensagens, mensagemErro]);
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

  private extrairConteudoResposta(resposta: Mensagem): string {
    const conteudo = resposta?.response?.message;
    
    if (conteudo && typeof conteudo === 'string' && conteudo.trim().length > 0) {
      return conteudo.trim();
    }
    
    return this.MENSAGEM_ERRO_EXTRACAO;
  }

  private extrairReferencias(resposta: Mensagem): (string | Referencia)[] {
    const refsRaw = resposta?.response?.references;

    if (Array.isArray(refsRaw)) {
      return refsRaw
        .map((r: any) => {
          if (typeof r === 'string') return r;
          if (r?.title && r?.url) return { title: r.title, url: r.url };
          if (r?.titulo && r?.url) return { title: r.titulo, url: r.url };
          if (r?.title) return r.title;
          if (r?.titulo) return r.titulo;
          if (r?.url) return r.url;
          return '';
        })
        .filter(Boolean);
    }

    return [];
  }

  private validarResposta(conteudo: string): boolean {
    return Boolean(conteudo && conteudo !== this.MENSAGEM_ERRO_EXTRACAO);
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
    localStorage.setItem(this.CHAVE_CONTADOR, this.contadorPerguntas().toString());
  }

  private salvarMensagens(): void {
    localStorage.setItem(this.CHAVE_MENSAGENS, JSON.stringify(this.mensagens()));
  }

  private salvarNivel(): void {
    localStorage.setItem(this.CHAVE_NIVEL, this.nivelConversacao());
  }

  private obterUserId(): string {
    let userId = localStorage.getItem(this.CHAVE_USUARIO_ID);
    if (!userId) {
      userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem(this.CHAVE_USUARIO_ID, userId);
    }
    return userId;
  }

  private removerTagsHtml(conteudo: string): string {
    return conteudo.replace(/<[^>]*>/g, '');
  }

  private temClipboardModerno(): boolean {
    return navigator.clipboard && window.isSecureContext;
  }

  private copiarComClipboardModerno(texto: string): void {
    navigator.clipboard.writeText(texto).then(() => {
      this.mostrarToast('Mensagem copiada para a área de transferência!');
    }).catch(() => {
      this.copiarComFallback(texto);
    });
  }

  private copiarComFallback(texto: string): void {
    const textArea = document.createElement('textarea');
    textArea.value = texto;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      document.execCommand('copy');
      this.mostrarToast('Mensagem copiada para a área de transferência!');
    } catch (err) {
      this.mostrarToast('Erro ao copiar mensagem', 'error');
    }
    
    document.body.removeChild(textArea);
  }

  private temWebShare(): boolean {
    return !!navigator.share;
  }

  private compartilharComWebShare(texto: string): void {
    navigator.share({
      title: 'IA Católica - Resposta',
      text: texto,
      url: window.location.href
    }).catch(() => {
      this.compartilharComFallback(texto);
    });
  }

  private compartilharComFallback(texto: string): void {
    const url = `https://wa.me/?text=${encodeURIComponent(texto + '\n\nFonte: IA Católica - ' + window.location.href)}`;
    window.open(url, '_blank');
  }

  private mostrarToast(mensagem: string, tipo: 'success' | 'error' = 'success'): void {
    const toast = document.createElement('div');
    toast.className = `alert alert-${tipo === 'success' ? 'success' : 'danger'} position-fixed`;
    toast.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    toast.textContent = mensagem;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
      if (document.body.contains(toast)) {
        document.body.removeChild(toast);
      }
    }, 3000);
  }

  selecionarNivel(nivel: 'basico' | 'intermediario' | 'avancado'): void {
    if (this.nivelConversacao() === nivel) return;
    this.nivelConversacao.set(nivel);
    this.salvarNivel();
  }

  private mostrarModalPerguntasEsgotadas(): void {
    const modalElement = document.getElementById('modalPerguntasEsgotadas');
    if (modalElement) {
      // Usar Bootstrap Modal API se disponível
      const modal = (window as any).bootstrap?.Modal?.getOrCreateInstance(modalElement);
      if (modal) {
        modal.show();
      } else {
        // Fallback: mostrar modal manualmente
        modalElement.classList.add('show');
        modalElement.style.display = 'block';
        modalElement.setAttribute('aria-hidden', 'false');
        
        // Adicionar backdrop
        const backdrop = document.createElement('div');
        backdrop.className = 'modal-backdrop fade show';
        backdrop.id = 'modalBackdrop';
        document.body.appendChild(backdrop);
        document.body.classList.add('modal-open');
      }
    }
  }

  fecharModalPerguntasEsgotadas(): void {
    const modalElement = document.getElementById('modalPerguntasEsgotadas');
    if (modalElement) {
      // Usar Bootstrap Modal API se disponível
      const modal = (window as any).bootstrap?.Modal?.getInstance(modalElement);
      if (modal) {
        modal.hide();
      } else {
        // Fallback: fechar modal manualmente
        modalElement.classList.remove('show');
        modalElement.style.display = 'none';
        modalElement.setAttribute('aria-hidden', 'true');
        
        // Remover backdrop
        const backdrop = document.getElementById('modalBackdrop');
        if (backdrop) {
          document.body.removeChild(backdrop);
        }
        document.body.classList.remove('modal-open');
      }
    }
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