import { useEffect, useState } from 'react';
import { ChatList } from '../components/ChatList';
import { ConversationPanel } from '../components/ConversationPanel';
import { useChat } from '../hooks/useChat';

export const ChatPage = () => {

    // obtener lista de chats
    const { getChatSessions, loadingChats, } = useChat();

    const [chats, setChats] = useState([]);
    const [selectedChatId, setSelectedChatId] = useState(0);


    const selectChat = (id: number) => {
        console.log(`Chat seleccionado: ${id}`);
        
        setSelectedChatId(id);

    }


    useEffect(() => {
        const fetchChatSessions = async () => {
            const data = await getChatSessions();
            setChats(data);
        }
        fetchChatSessions();

    }, [])



    if (loadingChats) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>

        )
    }

    return (
        <div className="container-fluid min-vh-100">
            <div className="row h-100">
                {/* lista de chats */}
                <div className="col-md-3 border-end d-flex flex-column h-100 overflow-hidden">
                    <ChatList chats={chats} selectChat={selectChat} selectedChatId={selectedChatId}  />
                </div>

                <div className='col-md-9 d-flex flex-column h-100 overflow-hidden p-3'>
                    <ConversationPanel chatId={selectedChatId} />
                </div>

            </div>

        </div>
    )
}


