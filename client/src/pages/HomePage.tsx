import bg1 from "../assets/bg1.svg";
import pp1 from "../assets/pp1.svg";
import avt from "../assets/avt.jpg";
import NavigationBar from "../components/navigationBar/NavigationBar";
import { useEffect, useState } from "react";
import Footer from "../components/homePage/Footer";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
  const navigate= useNavigate()

  useEffect(() => {
    // Trigger loading animation
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);

    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.target.id) {
            setVisibleSections(prev => new Set([...prev, entry.target.id]));
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    // Observe sections after component mounts
    const sections = document.querySelectorAll('[data-animate]');
    sections.forEach(section => observer.observe(section));

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, []);

  const getAnimationClass = (sectionId: string, baseClasses: string = ''): string => {
    const isVisible = visibleSections.has(sectionId);
    return `${baseClasses} transition-all duration-700 ease-out ${isVisible
        ? 'opacity-100 translate-y-0'
        : 'opacity-0 translate-y-8'
      }`;
  };

  const getStaggeredClass = (sectionId: string, delay: number = 0): string => {
    const isVisible = visibleSections.has(sectionId);
    return `transition-all duration-700 ease-out ${isVisible
        ? 'opacity-100 translate-y-0'
        : 'opacity-0 translate-y-8'
      } ${isVisible ? `delay-[${delay}ms]` : 'delay-0'}`;
  };


  return (
    <>
      <style>{floatingStyles}</style>
      <div className={`min-h-screen flex flex-col transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'
        }`}>
        <NavigationBar />

        {/* Hero Section */}
        <section
          id="hero"
          data-animate
          className="bg-green-50 py-16 px-4 md:px-8 lg:px-16 min-h-[90vh] flex items-center  overflow-hidden"
        >
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center">
            <div className={getAnimationClass('hero', 'md:w-1/2 mb-10 md:mb-0')}>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
                The Ultimate Destination for{" "}
                <span className="text-green-500 inline-block transform hover:scale-105 transition-transform duration-300">
                  Freelance Talent
                </span>{" "}
                and{" "}
                <span className="text-green-500 inline-block transform hover:scale-105 transition-transform duration-300">
                  Quality Services!
                </span>
              </h2>
              <p className={`text-gray-600 mb-8 ${getStaggeredClass('hero')}`} style={{ transitionDelay: '200ms' }}>
                Whether you're a business owner or a freelancer, WorkPlace is your
                one-stop-shop for finding or offering freelance services. Join our
                community today and start getting things done!
              </p>
              <div className={`flex flex-wrap gap-4 ${getStaggeredClass('hero')}`} style={{ transitionDelay: '400ms' }}>
                <button onClick={()=>navigate("/market-place")} className="bg-green-500 text-white px-6 py-3 rounded-md hover:bg-green-600 hover:scale-105 transform transition-all duration-300 hover:shadow-lg">
                  Find Work
                </button>
               
              </div>
            </div>
            <div className={getAnimationClass('hero', 'md:w-1/2 flex justify-center')}>
              <img
                src={bg1}
                alt="People working together illustration"
                className="max-w-full h-auto transform hover:scale-105 transition-transform duration-500 rounded-lg animate-float"
                style={{ transitionDelay: '300ms' }}
              />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section
          id="features"
          data-animate
          className="bg-white py-16 px-4 md:px-8 lg:px-16  min-h-screen flex items-center overflow-hidden"
        >
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center">
            <div className={getAnimationClass('features', 'md:w-1/2 mb-10 md:mb-0')}>
              <img
                src={pp1}
                alt="Freelancer working illustration"
                className="max-w-full h-auto transform hover:scale-105 transition-transform duration-500 rounded-lg animate-float-gentle"
              />
            </div>
            <div className={getAnimationClass('features', 'md:w-1/2 md:pl-12')}>
              <h3 className="text-2xl font-bold mb-8">
                A whole world of freelancers talent at your fingertips.
              </h3>

              <div className={`mb-8 ${getStaggeredClass('features')}`} style={{ transitionDelay: '200ms' }}>
                <h4 className="text-lg font-semibold mb-2 flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3 inline-block"></span>
                  The best for every budget
                </h4>
                <p className="text-gray-600 ml-5">
                  Find quality freelancers at every price point. From budget-friendly options to premium expertise, we have talent that fits your needs and budget perfectly.
                </p>
              </div>

              <div className={getStaggeredClass('features')} style={{ transitionDelay: '400ms' }}>
                <h4 className="text-lg font-semibold mb-2 flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3 inline-block"></span>
                  Quality work done quickly
                </h4>
                <p className="text-gray-600 ml-5">
                  Get your projects completed faster without compromising on quality. Our verified freelancers deliver exceptional results within your timeline.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Additional animated section for demonstration */}
        <section
          id="cta"
          data-animate
          className="bg-gradient-to-r from-green-500 to-green-600 py-16 px-4 md:px-8 lg:px-16"
        >
          <div className="max-w-4xl mx-auto text-center">
            <h3 className={getAnimationClass('cta', 'text-3xl font-bold text-white mb-6')}>
              Ready to Get Started?
            </h3>
            <p className={`text-green-100 mb-8 text-lg ${getStaggeredClass('cta')}`} style={{ transitionDelay: '200ms' }}>
              Join thousands of satisfied clients and freelancers on WorkPlace today.
            </p>
            <button className={`bg-white text-green-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 hover:scale-105 transform transition-all duration-300 hover:shadow-xl ${getStaggeredClass('cta')}`} style={{ transitionDelay: '400ms' }}>
              Get Started Now
            </button>
          </div>
        </section>
        <Footer />
      </div>
    </>
  );
}

const floatingStyles = `
  @keyframes float {
    0%, 100% {
      transform: translateY(0px) translateX(0px);
    }
    25% {
      transform: translateY(-10px) translateX(5px);
    }
    50% {
      transform: translateY(-5px) translateX(-8px);
    }
    75% {
      transform: translateY(-15px) translateX(3px);
    }
  }
  
  @keyframes floatGentle {
    0%, 100% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-20px);
    }
  }
  
  @keyframes sway {
    0%, 100% {
      transform: translateX(0px) rotate(0deg);
    }
    25% {
      transform: translateX(10px) rotate(1deg);
    }
    75% {
      transform: translateX(-10px) rotate(-1deg);
    }
  }
  
  .animate-float {
    animation: float 6s ease-in-out infinite;
  }
  
  .animate-float-gentle {
    animation: floatGentle 4s ease-in-out infinite;
  }
  
  .animate-sway {
    animation: sway 8s ease-in-out infinite;
  }
`;



export function FreelancerCard() {
  return (
    <div className="bg-green-50 border border-green-100 rounded-lg p-6 flex flex-col items-center">
      <div className="w-16 h-16 bg-green-200 rounded-full mb-4 overflow-hidden">
        <img
          src={avt}
          alt="Freelancer profile"
          className="w-full h-full object-cover"
        />
      </div>
      <h3 className="text-lg font-medium mb-1">John</h3>
      <p className="text-sm text-gray-500 text-center mb-4">
        Lorem ipsum is simply dummy text of the printing.
      </p>
      <div className="flex w-full justify-between mt-auto">
        <button className="bg-green-500 text-white px-3 py-1 rounded text-sm">
          Message
        </button>
        <div className="text-green-500 text-sm font-medium">$30/hr</div>
      </div>
    </div>
  );
}
