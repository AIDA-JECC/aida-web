import './ChatAnswer.css'
import svg from "./assets/react.png"
import pic from "./assets/chatButtons.png"
import {TypeAnimation} from 'react-type-animation';

function ChatAnswer(props) {
    return (
        <>
        <div className='chatWindowA'>
            <img className='botIcon' src={svg} alt='AIDA chatbot icon' loading="lazy" />
            <div className='chatBoxA'>
                <TypeAnimation
                className='chatBoxAp' 
                cursor={false}
                splitter={
                    (str) => str.split(/(?= )/)
                }
                sequence={
                    [
                        props.content,
                    ]
                }
                speed={{ type: 'keyStrokeDelayInMs',value: 70 }}
                style={{color: props.color,fontSize: props.fontsize}}
                deletionSpeed={0}
                repeat={true}
                wrapper='span'
                />
            </div>
        </div>
        {/* <img src={pic} className='chatButtons' alt='chat buttons'></img> */}
        </>
    );
}

export default ChatAnswer;