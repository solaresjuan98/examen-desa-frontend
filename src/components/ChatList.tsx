import { ChatSession } from "../interfaces";

interface ChatListProps {
    chats: ChatSession[];
    selectChat: (id: number) => void;
    selectedChatId: number;
}

export const ChatList = ({ chats, selectChat, selectedChatId }: ChatListProps) => {

    const formatChatContext = (context: string) => {

        const obj = JSON.parse(context);
        console.log(obj.tema);

        return obj.tema;
    }

    return (
        <>
            <h5>Mis Chats</h5>
            <ul className="list-group" id="chatList">
                {chats.map((chat) => (
                    <li
                        key={chat.id}
                        onClick={() => selectChat(chat.id)}
                        className={`list-group-item d-flex justify-content-between align-items-center hover-pointer ${chat.id === selectedChatId ? 'active' : ''}`}>
                        {formatChatContext(chat.contexto)}
                    </li>
                ))}

            </ul>
        </>
    )
}
