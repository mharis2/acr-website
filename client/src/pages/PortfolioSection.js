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
  
      // Clean up function
      return () => {
        window.removeEventListener("resize", handleWindowResize);
      };
    }, []);
  
    const isMobile = windowWidth <= 768;
  
    const cardStyle = {
      width: isMobile ? '90vw' : '28rem',
      maxWidth: '100%',
    };
  
    const imgStyle = {
      height: 'auto',
      width: '100%',
      objectFit: 'cover',
    };
  
    return (
      <Card style={cardStyle} key={item.id}>
        <Card.Img variant="top" src={`${process.env.REACT_APP_BASE_URL}/images/${item.image}`} style={imgStyle} />
        <Card.Body>
          <Card.Title style={{ textAlign: 'left', fontWeight: 'bold', fontSize: '1.2rem' }}>{item.title}</Card.Title>
          <Card.Text style={{ textAlign: 'left', fontSize: '1rem' }}>{item.description}</Card.Text>
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
          <h2>Exquisite craftsmanship in every project</h2>
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
