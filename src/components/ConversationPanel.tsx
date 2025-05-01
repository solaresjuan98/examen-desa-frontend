import { FormEvent, useEffect, useState } from "react";
import { useChat } from "../hooks/useChat";
import { Message } from "../interfaces";
import ReactMarkdown from 'react-markdown';
import { LoaderOverlay } from "./LoaderOverlay";
import Swal from 'sweetalert2';

interface ConversationPanelProps {
    chatId: number;

}

export const ConversationPanel = ({ chatId }: ConversationPanelProps) => {

    const {
        getMessages,
        sendOnlyTextMessage,
        sendImageMessage,
        sendPdfMessage,
        sendVectorMessages,
        deleteChatMessages,
        setLoadingMessages,
        loadingMessages
    } = useChat();
    const [messages, setMessages] = useState<Message[]>([]);
    const [textMessage, setTextMessage] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [disableBtn, setDisableBtn] = useState(false);
    const [creativeMode, setCreativeMode] = useState(false);


    const fetchMessages = async (selectedChatId: number) => {

        if (selectedChatId !== 0) {

            const data = await getMessages(selectedChatId);


            setMessages(data);
            setLoadingMessages(false);

        }


    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTextMessage(e.target.value);
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {

        const files = e.target.files?.[0];
        if (files) {
            console.log(files);
            // Aquí puedes manejar los archivos seleccionados
            // Por ejemplo, puedes enviarlos a tu servidor o hacer algo más con ellos
            setFile(files);
            return;
        }
        console.log('No se seleccionó ningún archivo');
    }

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {

        setCreativeMode(e.target.checked);
        console.log('Checkbox value:', e.target.checked);

    }

    const onSendMessage = async (event: FormEvent<HTMLFormElement>) => {
        // todo: validar si hay archivos
        event.preventDefault();
        setDisableBtn(true);



        if (!textMessage && !file && !creativeMode) {
            alert('Escribe un mensaje o selecciona un archivo para enviar');
            setDisableBtn(false);
            return;
        }

        if (!textMessage && file && !creativeMode) {
            alert('No se puede enviar solo un archivo');
            setDisableBtn(false);
            return;
        }

        if (textMessage && file && !creativeMode) {
            // enviar mensaje con texto y archivo

            // image/png
            // application/pdf
            if (file.type === 'image/png') {

                const response = await sendImageMessage(chatId, textMessage, file);
                console.log(response);
                resetForm(response.status);
                return;
            }

            if (file.type === 'application/pdf') {
                const response = await sendPdfMessage(chatId, textMessage, file);
                console.log(response);
                resetForm(response.status);
                return;
            }

        }

        if (textMessage && !file && !creativeMode) {
            const response = await sendOnlyTextMessage(chatId, textMessage);

            resetForm(response.status);
        }

        // validar si es en modo MCP / pgvector / vector
        if (creativeMode && textMessage && !file) {
            const response = await sendVectorMessages(chatId, textMessage);
            resetForm(response.status);
        }


        setDisableBtn(false);
    }

    const resetForm = (httpStatusCode: number) => {
        if (httpStatusCode === 200) {
            const messageInput = document.getElementById('messageInput') as HTMLInputElement;
            messageInput.value = '';
            const fileInput = document.getElementById('fileInput') as HTMLInputElement;
            fileInput.value = '';
            setDisableBtn(false);
            setTextMessage('');
            setFile(null);
            fetchMessages(chatId);

        }
    }


    const deleteMessages = async () => {

        const response = await deleteChatMessages(chatId);

        if (response.status === 200) {
            // alert('Chat limpiado con exito');
            Swal.fire({
                title: 'Chat limpiado con exito',
                icon: 'success',
                showConfirmButton: false,
                timer: 1500
            })
            fetchMessages(chatId);
        }


    }

    useEffect(() => {
        fetchMessages(chatId);
    }, [chatId, loadingMessages])


    if (loadingMessages) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <div className="spinner-border text-primary" role="status">

                    <span className="visually-hidden">Loading messages...</span>
                </div>
            </div>
        )

    }

    return (
        <div className="d-flex flex-column h-100">
            {
                chatId === 0 ? (
                    <>
                        <div className="d-flex justify-content-center align-items-center vh-100">
                            <h2 className="text-muted">Selecciona un chat para ver la conversación</h2>
                        </div>
                    </>

                ) : (
                    <>
                        <div className="d-flex justify-content-end mb-2">
                            <button className="btn btn-outline-danger btn-sm" onClick={() => deleteMessages()}>
                                Limpiar chat
                            </button>
                        </div>
                        <div className="flex-grow-1 overflow-auto p-3 border rounded mb-2 chat-window" id="chatWindow">

                            <LoaderOverlay show={disableBtn} />

                            {
                                messages.map((message) => (
                                    <>
                                        <div className="chat-bubble chat-user align-self-end">
                                            <ReactMarkdown>{message.contenido}</ReactMarkdown>
                                            {message.tipo_archivo === 'image/png' && (
                                            <>
                                                {/* <p>{message.url_archivo}/{message.nombre_original}</p> */}
                                                {/* /Users/juansolares/courses/prueba-innovacion/backend/img/english.png */}
                                                {/* ${message.url_archivo}/${message.nombre_original} */}
                                                <img src={`src/img/${message.nombre_original}`} alt="imagen" />
                                            </>


                                            )}
                                        </div>
                                        {

                                        }
                                        <div className="chat-bubble chat-bot align-self-start">
                                    
                                            <ReactMarkdown>{message.contenido_respuesta}</ReactMarkdown>
                                        </div>
                                    </>
                                ))
                            }
                        </div>

                        {/* <!-- Formulario de Entrada --> */}
                        <form className="d-flex gap-2" encType="multipart/form-data" onSubmit={onSendMessage}>
                            <input type="text"
                                id="messageInput"
                                className="form-control"
                                onChange={handleInputChange}
                                placeholder="Escribe un mensaje..." />
                            <input
                                type="file"
                                id="fileInput"
                                className="form-control form-control-sm"
                                accept="image/*,.pdf"
                                onChange={handleFileChange}
                            />
                            <button type="submit" className="btn btn-primary" disabled={disableBtn}>Enviar</button>
                        </form>
                        <div className="form-check d-flex align-items-center">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                id="creativeMode"
                                onChange={handleCheckboxChange}
                            />
                            <label className="form-check-label ms-1" htmlFor="creativeMode">
                                Consultar de forma creativa
                            </label>
                        </div>
                    </>
                )
            }

        </div>
    )
}
