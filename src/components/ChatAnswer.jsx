import './ChatAnswer.css'
import svg from "./assets/react.png"

function ChatAnswer(props) {
    return (
        <>
        <div className='chatWindowA'>
            <img className='botIcon' src={svg} alt='AIDA chatbot icon' loading="lazy" />
            <div className='chatBoxA'>
                <p>{props.content}</p>
            </div>
        </div>
        {/* <img src={pic} className='chatButtons' alt='chat buttons'></img> */}
        </>
    );
}

export default ChatAnswer;