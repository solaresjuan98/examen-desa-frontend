import { useEffect, useState } from 'react';
import axios from '../axios/axios';
import { Message } from '../interfaces';

export const useChat = () => {

    const [loadingChats, setLoadingChats] = useState(true);
    const [loadingMessages, setLoadingMessages] = useState(true);

    const getChatSessions = async () => {
        console.log('f');
        try {
            const { data } = await axios.get('/get-chats');
            console.log(data);
            setLoadingChats(false);
            return data;
        } catch (error) {
            console.log('f');

            setLoadingChats(false);
            console.error('Error al obtener las sesiones de chat:', error);
        }

    }

    const getMessages = async (chatId: number): Promise<Message[]> => {

        try {
            console.log('chatId', chatId);

            const { data } = await axios.get(`/get-messages/chat/${chatId}`);
            setLoadingMessages(false);
            return data;
        } catch (error) {
            console.error('Error al obtener los mensajes:', error);
            setLoadingMessages(false);
        }

        return []; // Add a return statement to handle the case when an error occurs.

    }

    // mensaje solo texto
    const sendOnlyTextMessage = async (chatId: number, message: string) => {

        try {
            const { data } = await axios.post('/consultar', {
                chat_id: chatId,
                pregunta: message
            });
            return data;
        } catch (error) {
            console.error('Error al enviar el mensaje:', error);
        }
    }

    // mensaje con imagen 
    const sendImageMessage = async (chatId: number, message: string, file: File) => {

        try {
            const formData = new FormData();
            formData.append('image', file);
            formData.append('pregunta', message);
            formData.append('chat_id', chatId.toString());

            const { data } = await axios.post('/analizar-imagen', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return data;
        } catch (error) {
            console.error('Error al enviar el mensaje:', error);
        }

    }

    // mensaje con pdf
    const sendPdfMessage = async (chatId: number, message: string, file: File) => {

        try {
            const formData = new FormData();
            formData.append('archivo', file);
            formData.append('pregunta', message);
            formData.append('chat_id', chatId.toString());

            const { data } = await axios.post('/analizar-pdf', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return data;
        } catch (error) {
            console.error('Error al enviar el mensaje:', error);
        }

    }


    // consulta a mcp
    const sendMCPMessage = async (chatId: number, message: string) => {

        try {
            const { data } = await axios.post('/knowledge/search', {
                chat_id: chatId,
                query: message
            });
            return data;
        } catch (error) {
            console.error('Error al enviar el mensaje:', error);
        }

    }


    const deleteChatMessages = async (chatId: number) => {

        try {
            //
            const { data } = await axios.delete(`/delete-chat/${chatId}`);

            if (data.status === 200) {
                console.log('Mensajes eliminados correctamente');

            }
            return data;
        } catch (error) {
            //
            console.error('Error al eliminar los mensajes:', error);

        }

    }




    useEffect(() => {

        const fetchChatSessions = async () => {
            await getChatSessions();
        }
        fetchChatSessions();

    }, [loadingChats])


    return {
        getChatSessions,
        getMessages,
        sendOnlyTextMessage,
        sendImageMessage,
        sendPdfMessage,
        sendMCPMessage,
        deleteChatMessages,
        loadingChats,
        loadingMessages,
        setLoadingMessages,
    }

}
