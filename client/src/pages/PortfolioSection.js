import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import Card from 'react-bootstrap/Card';

const responsive = {
  desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
  },
  tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
  },
  mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
  }
};


const PortfolioCard = ({ item }) => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleWindowResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  const isMobile = windowWidth <= 768;

  const cardStyle = {
    width: isMobile ? '80vw' : '28rem',
    maxWidth: '100%',
  };

  const imgStyle = {
    height: isMobile ? '15rem' : '600px', 
    width: '500px',
    objectFit: 'cover',
    boxShadow: '0 4px 6px 0 hsla(0, 0%, 0%, 0.2)',
  };

  const imgWrapperStyle = {
    overflow: 'hidden', // Ensure the image doesn't overflow the wrapper div.
    borderRadius: '.8rem',
  };

  const cardBodyStyle = {
    padding: '2rem 1.25rem', // Added more padding to distance the text from the image
  };

  const titleStyle = {
    textAlign: 'left', 
    fontWeight: 'bold',
    fontSize: isMobile ? '1rem' : '1.4rem',

  };

  const textStyle = {
    textAlign: 'left', 
    fontSize: isMobile ? '0.8rem' : '1.1rem',
  };

  return (
    <Card style={cardStyle} key={item.id}>
      <div style={imgWrapperStyle}>
        <Card.Img variant="top" src={`${process.env.REACT_APP_BASE_URL}/images/${item.image}`} style={imgStyle} />
      </div>
      <Card.Body style={cardBodyStyle}>
        <Card.Title style={titleStyle}>{item.title}</Card.Title>
        <Card.Text style={textStyle}>{item.description}</Card.Text>
      </Card.Body>
    </Card>
  );
};




  
  

const PortfolioSection = () => {
    const [portfolioItems, setPortfolioItems] = useState([]);

    useEffect(() => {
        const fetchPortfolioItems = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/portfolio`);
                setPortfolioItems(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchPortfolioItems();
    }, []);

    if (!portfolioItems.length) {
        return <div>Loading...</div>; // Render a loading state while the items are being fetched
    }

    return (
      <section id="portfolio" className="portfolio-section">
          <h2 style={{ marginBottom: '5rem' }}>Exquisite craftsmanship in every project</h2>
          <div className="carousel">
              <Carousel 
                  responsive={responsive}
                  infinite={true}
                  autoPlaySpeed={1000}
                  keyBoardControl={true}
                  customTransition="transform 1000ms ease-in-out"  // Adjust this value
                  transitionDuration={1000} // Adjust this value
                  showDots={true}
                  arrows={true}
                  containerClass="carousel"
                  renderButtonGroupOutside={true} // Render the button group outside of the carousel
              >
                  {portfolioItems.map(item => (
                      <div style={{ display: 'flex', justifyContent: 'center' }}>
                          <PortfolioCard item={item} />
                      </div>
                  ))}
              </Carousel>
          </div>
      </section>
    );
    
};

export default PortfolioSection;
