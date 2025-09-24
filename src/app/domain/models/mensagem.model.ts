export interface Mensagem {
    mensagem: string;
    referencias?: (string | Referencia)[];
    autor: 'usuario' | 'ia';
    dataHora: Date;
    parcial?: boolean;
}

export interface Referencia {
    titulo: string;
    url: string;
}

export const NIVEL_DEFINICOES = {
    basico: {
        nivel: 'basico',
        definicao: 'O usuário tem pouco ou nenhum conhecimento aprofundado sobre a doutrina católica. Ele espera receber uma resposta clara e concisa sem termos complexos.'
    },
    intermediario: {
        nivel: 'intermediario',
        definicao : 'O usuário já tem uma base, mas precisa de detalhes sobre porquês, contextos históricos e teológicos. Ele espera receber uma resposta sólida da doutrina católica e da história da igreja.'
    },
    avancado: {
        nivel: 'avancado',
        definicao: 'O usuário já tem um conhecimento sólido da doutrina católica e da história da igreja. Ele espera receber respostas que integrem diferentes fontes do Magistério, oferecendo um panorama completo e com referências precisas.'
    }
} as const;

export interface Pergunta {
    pergunta: string;
    nivelConversacao: typeof NIVEL_DEFINICOES.basico | typeof NIVEL_DEFINICOES.intermediario | typeof NIVEL_DEFINICOES.avancado;
    linksConfiaveis: Referencia[];
}

export function CriarNivelObjeto(nivel: 'basico' | 'intermediario' | 'avancado'): typeof NIVEL_DEFINICOES.basico | typeof NIVEL_DEFINICOES.intermediario | typeof NIVEL_DEFINICOES.avancado {
    return NIVEL_DEFINICOES[nivel];
}

export interface Resposta {
    resposta: string;
    referencias: (string | Referencia)[];
    fontesConsultadas: string[];
}

export interface ConfiguracaoIA {
    temperatura: number;
    maxTokens: number;
    provedor: string;
    modelo: string;
    apiKey: string;
    baseUrl?: string;
}
