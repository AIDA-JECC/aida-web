import './Para.css';
import ChatBot from './assets/cube.gif';
import {TypeAnimation} from 'react-type-animation';
function Para(props) {
    if (props.indexImg === 1) {
        return (
            <div className='tester1'>
                <TypeAnimation
                className='TypeAnimation1' 
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
        );
    }
    else if (props.indexImg === 10) {
        return (
            <div className='tester10'>
                <TypeAnimation
                className='TypeAnimation10' 
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
        );
    }
    else if (props.indexImg === 2) {
        return (
            <div className='tester2'>
                <img src={ChatBot} alt="BOT" className='ChatBot2' />
                <TypeAnimation
                className='TypeAnimation1' 
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
                style={{fontSize: props.fontsize, color: 'white'}}
                deletionSpeed={0}
                repeat={true}
                wrapper='span'
                />
            </div>
        );
    }
    else if (props.indexImg === 3) {
        return (
            <div className='tester2'>
                <img src={ChatBot} alt="BOT" className='ChatBot2' />
                <TypeAnimation
                className='TypeAnimation2' 
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
                style={{fontSize: props.fontsize, color: 'white'}}
                deletionSpeed={0}
                repeat={true}
                wrapper='span'
                />
            </div>
        );
    }
    else{
    return(
        <>
            <div className='tester0'>
                <img src={ChatBot} alt="BOT" className='ChatBot' />
                <TypeAnimation
                className={'TypeAnimation0' }
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
                style={{fontSize: props.fontsize, color: 'white'}}
                deletionSpeed={0}
                repeat={true}
                wrapper='span'
                />
            </div>
        </>
    );
    }
}


export default Para;