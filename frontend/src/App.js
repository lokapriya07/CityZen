import React from "react";
import "./App.css";
import "./style.css";



function App() {
  return (
    <>
      {/* ======= Header ======= */}
      <header id="header" className="fixed-top ">
        <div className="container d-flex align-items-center">
          <h1 className="logo me-auto">
            <a href="/">Waste Management System</a>
          </h1>

          <nav id="navbar" className="navbar">
            <ul>
              <li>
                <a className="nav-link scrollto active" href="#hero">
                  <span className="fa fa-home"> Home </span>
                </a>
              </li>
              <li>
                <a className="nav-link scrollto" href="#about">
                  <span className="fa fa-info-circle"> About us</span>
                </a>
              </li>
              <li>
                <a className="nav-link scrollto" href="phpGmailSMTP/trash.php">
                  <span className="fa fa-trash"> Complain</span>
                </a>
              </li>
              <li>
                <a className="nav-link scrollto" href="adminlogin/welcome.php">
                  <span className="fa fa-edit"> Preview Complain</span>
                </a>
              </li>
              <li>
                <a className="nav-link scrollto" href="#faq">
                  <span className="fa fa-question-circle"> FAQ</span>
                </a>
              </li>
              <li>
                <a className="nav-link scrollto" href="logout-user.php">
                  <span className="fas fa-sign-out-alt"> Logout</span>
                </a>
              </li>
            </ul>
            <i className="bi bi-list mobile-nav-toggle"></i>
          </nav>
        </div>
      </header>

      {/* ======= Hero Section ======= */}
      <section id="hero" className="d-flex align-items-center">
        <div className="container">
          <div className="row">
            <div
              className="col-lg-6 d-flex flex-column justify-content-center pt-4 pt-lg-0 order-2 order-lg-1"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <h1>Better Solutions For The Waste Around You!</h1>
              <h2>Keep our Environment Healthy</h2>
              <div className="d-flex justify-content-center justify-content-lg-start">
                <a href="#about" className="btn-get-started scrollto">
                  Get Started
                </a>
                <a
                  href="https://youtu.be/mQ93IcGCag4"
                  className="glightbox btn-watch-video"
                >
                  <i className="bi bi-play-circle"></i>
                  <span>Watch Video</span>
                </a>
              </div>
            </div>
            <div
              className="col-lg-6 order-1 order-lg-2 hero-img"
              data-aos="zoom-in"
              data-aos-delay="200"
            >
              <img src="assets/img/recycling.jpeg" className="img-fluid animated" alt="hero" />
            </div>
          </div>
        </div>
      </section>

      {/* ======= About Us Section ======= */}
      <section id="about" className="about">
        <div className="container" data-aos="fade-up">
          <div className="section-title">
            <h2>About Us</h2>
          </div>

          <div className="row content">
            <div className="col-lg-6">
              <p>
                The ‘WASTE MANAGEMENT SYSTEM’ is a web application aimed to provide a
                digital way of complaining the concerns of general citizens to
                their relative municipalities.
              </p>
              <ul>
                <li>
                  <i className="ri-check-double-line"></i> Complaining about waste
                  or garbage problems near their locality.
                </li>
                <li>
                  <i className="ri-check-double-line"></i> See their complain
                  Report and check if the work is done or not.
                </li>
                <li>
                  <i className="ri-check-double-line"></i> People can take
                  different ideas regarding recycling of waste.
                </li>
              </ul>
            </div>
            <div className="col-lg-6 pt-4 pt-lg-0">
              <p>
                Complaining about the waste problem encountered everyday to
                municipality is a hefty process and waste management aims to make
                this process easier. With a simple handheld device with internet,
                users can complain their concerns to municipality. The automated
                system will redirect the complaints. Municipality admins can
                acknowledge reports to update users if their complaint is addressed
                or not.
              </p>
              <a href="#" className="btn-learn-more">
                Learn More
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ======= Footer ======= */}
      <footer id="footer">
        <div className="footer-top">
          <div className="container">
            <div className="row">
              <div className="col-lg-3 col-md-6 footer-contact">
                <h3>
                  <img
                    src="assets/img/clients/Capture.PNG"
                    style={{ width: "80px", height: "60px" }}
                    alt="logo"
                  />
                </h3>
                <p>
                  Moti Nagar <br /> New Delhi, Delhi <br /> India <br />
                  <br />
                  <strong>Phone:</strong> +91 9871946454
                </p>
              </div>

              <div className="col-lg-3 col-md-6 footer-links">
                <h4>Useful Links</h4>
                <ul>
                  <li>
                    <a href="#">Home</a>
                  </li>
                  <li>
                    <a href="#about">About us</a>
                  </li>
                  <li>
                    <a href="#faq">FAQ</a>
                  </li>
                  <li>
                    <a href="#">Terms of service</a>
                  </li>
                  <li>
                    <a href="#">Privacy policy</a>
                  </li>
                </ul>
              </div>

              <div className="col-lg-3 col-md-6 footer-links">
                <h4>Our Services</h4>
                <ul>
                  <li>Waste Pickup</li>
                  <li>E-management Waste</li>
                  <li>Garbage Management</li>
                  <li>Awareness Program</li>
                  <li>Complaint Handling</li>
                </ul>
              </div>

              <div className="col-lg-3 col-md-6 footer-links">
                <h4>Our Social Networks</h4>
                <p>
                  Follow us on our social media to stay updated about community
                  waste management.
                </p>
                <div className="social-links mt-3">
                  <a href="https://twitter.com/imLakshay08" className="twitter">
                    <i className="bx bxl-twitter"></i>
                  </a>
                  <a href="#" className="instagram">
                    <i className="bx bxl-instagram"></i>
                  </a>
                  <a
                    href="https://www.linkedin.com/in/imlakshay08/"
                    className="linkedin"
                  >
                    <i className="bx bxl-linkedin"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container footer-bottom clearfix">
          <div className="copyright">
            &copy; Copyright <strong>WMS</strong>. All Rights Reserved
          </div>
          <div className="credits">
            Designed by <a href="https://github.com/janakbist">Janakbist</a> &
            <a href="https://github.com/imlakshay08"> Lakshay Tyagi</a>
          </div>
        </div>
      </footer>
    </>
  );
}

export default App;
