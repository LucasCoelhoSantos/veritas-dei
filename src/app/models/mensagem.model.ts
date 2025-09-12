export interface Referencia {
    title: string;
    url: string;
}

export interface RespostaModel {
    message: string;
    references: (string | Referencia)[];
}

export interface Mensagem {
    response: RespostaModel;
    timestamp: Date;
    n8nResponse: boolean;
}
