import React from "react";

function About() {
  return (
    <div>
      <div id="aboutLurker">
        <div className="textOne">A place for Nerds</div>
        <div className="textTwo">
          Our mission is to give users full control of what content they decide
          to interact with, that includes your ads.
        </div>
      </div>

      <div>
        <div className="reqOuterContainer">
          <div className="textOne">
            Want to help out? Things that need to be updated:
          </div>
          <div className="reqContainer">
            <div className="textThree">Landing page ("/")</div>

            <div className="reqContainerTexts">
              <div>
                <div className="textTwo">Update app logo</div>
                <div className="containerText">
                  <div className="indivText">
                    - Redesign the current app logo, current logo has weird
                    rendering artifacts. Lighting should be smoother
                  </div>
                </div>
              </div>

              <div>
                <div className="textTwo">Update Navigation Bar</div>
                <div className="containerText">
                  <div className="indivText">
                    -Add animation to side bar on landing page when opening and
                    closing it from the side (currently the right side).
                  </div>
                  <div className="indivText">
                    - Add a trigger event that closes the side nav when you
                    click outsite of it.
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="reqContainer">
            <div className="textThree">
              Landing page ("/login" , "/register")
            </div>

            <div className="reqContainerTexts">
              <div>
                <div className="textTwo">Update form validation</div>
                <div className="containerText">
                  <div className="indivText">
                    - Add form validation to the front end and back end for the
                    login and register forms (
                    <a
                      href="https://formik.org/docs/guides/validation"
                      target="_blank"
                    >
                      https://formik.org/docs/guides/validation
                    </a>
                    )
                  </div>
                </div>
              </div>
              <div>
                <div className="textTwo">Add error handling</div>
                <div className="containerText">
                  <div className="indivText">
                    - Add error handling to the front end and backend (incorrect
                    password, rate limited) .
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
