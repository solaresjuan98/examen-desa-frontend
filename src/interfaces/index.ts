
export interface ChatSession {
    id:           number;
    citizen_id:   number;
    fecha_inicio: Date;
    fecha_fin:    Date | null;
    contexto:     string;
}

export interface Message {
    id:                  number;
    contenido:           string;
    tipo_mensaje:        string;
    contenido_respuesta: string;
    confianza:           string;
    nombre_original:     string;
    url_archivo:         string;
    tipo_archivo:        string;
}

