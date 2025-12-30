import Header from "./components/Header"
import Footer from "./components/Footer";
import Intro from "./components/Intro";
import Para from "./components/Para";
import './App.css';
import Recent from "./components/Recent";
import ChatQuestion from "./components/ChatQuestion";
import ChatAnswer from "./components/ChatAnswer";
import Members from "./components/Members";


function Home() {
    return (
      <div className="App">
        <Header />
        <Intro />
        <Recent />
        <ChatQuestion 
        key="question-1"
        content="'' Hey AIDA, what's your life goal? Are you trying to conquer the world or just make it smarter? ''" 
        />
        <ChatAnswer
        key="answer-1"
        content="Creating ethical leaders in the domain of Artificial intelligence and data Science through effectual teaching and learning process to develop emerging technology solutions for the benefits of industry and society with a focus on holistic learning and excellence."
        />
        <ChatQuestion
        key="question-2"
        content="'' What's your grand vision, AIDA? Any AI revolutions planned? ''" 
        />
        <ChatAnswer
        key="answer-2"
        content="Strengthening basic competencies in the domains of Artificial Intelligence and Data Science. Providing high-quality, value-based technical education and developing technology professionals with creative ideas and compelling leadership abilities. Using logical thinking to create and develop cutting-edge products in collaboration with industry stakeholders in order to meet global expectations and requirements. Enabling graduates to adapt to new technologies via strong fundamentals and lifetime learning."
        />
        <ChatQuestion
        key="question-3"
        content="'' What's your origin story? Every hero has one! ''" 
        />
        <ChatAnswer
        key="answer-3"
        content="The Department of Artificial Intelligence & Data Science at Jyothi Engineering College was established in 2020 and is affiliated with KTU , marking it as one of the first colleges to introduce this course.
Our accomplished faculty, seasoned experts in both AI , ensure a well-rounded education,engaging in groundbreaking research projects led by faculty members excelling in both AI , showcasing our commitment to innovation and offering diverse exploration, from classic algorithms to the latest advancements in artificial intelligence."
        />
        <Para fontsize="30px" content="The core team serves as the backbone of our organization, guiding its growth, shaping its vision, and ensuring the successful implementation of its initiatives.meet our core team"/>
        <Members />
        <Footer />
      </div>
    );
}

export default Home
