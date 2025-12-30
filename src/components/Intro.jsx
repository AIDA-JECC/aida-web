import './Intro.css';
import Para from './Para';
import pic from './assets/intro.png';

function Intro() {

    return (
        <>
            <div className='ImageHolder'>
                <img src={"https://ik.imagekit.io/AIDA/Assets%20for%20Web/intro.png?updatedAt=1738262676780"} alt="AIDA Logo" className='introImage' />
            </div>
            <Para fontsize="24px" content="Welcome to AIDA!"></Para>
            <Para indexImg={1} className='introContent' content="We are thrilled to welcome you to our community of innovators, thinkers, and problem-solvers. AIDA is dedicated to creating a vibrant platform where AI and data science professionals, enthusiasts, and students can connect, collaborate, and grow together. Whether you're looking to expand your knowledge, advance your career, or contribute to the evolution of these transform."></Para>
        </>
    );
}

export default Intro;