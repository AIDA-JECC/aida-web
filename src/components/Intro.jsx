import './Intro.css';
import Para from './Para';
import pic from './assets/intro.png';

function Intro() {

    return (
        <>
            <div className='ImageHolder'>
                <img src={pic} alt="AIDA Logo" className='introImage' loading="lazy" />
            </div>
            <Para fontsize="24px" content="Welcome to AIDA!"></Para>
            <Para indexImg={1} fontsize="24px" content="We are thrilled to welcome you to our community of innovators, thinkers, and problem-solvers. AIDA is dedicated to creating a vibrant platform where AI and data science professionals, enthusiasts, and students can connect, collaborate, and grow together. Whether you're looking to expand your knowledge, advance your career, or contribute to the evolution of these transformative technologies."></Para>
        </>
    );
}

export default Intro;