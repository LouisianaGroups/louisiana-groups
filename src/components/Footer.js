import React from "react";

const Footer = () => (
  <footer>
    <div className="row p-3">
      <div className="col-12">
        <div className="d-flex justify-content-between">
          <div>
            <span className="hidden-xs-down">
              <a href="/">Louisiana Groups</a> is{" "}
            </span>
            <i className="fas fa-code" /> with <i className="fas fa-heart" /> by{" "}
            <a
              className="ml-1"
              target="_blank"
              rel="noopener noreferrer"
              href="http://adamculpepper.net"
            >
              <img
                className="rounded-circle"
                src="adam.jpg"
                alt="GitHub profile pic of @adamculpepper"
              />
            </a>
            <a
              className="ml-1"
              target="_blank"
              rel="noopener noreferrer"
              href="https://nick.scheurich.me"
            >
              <img
                className="rounded-circle"
                src="nick.jpg"
                alt="GitHub profile pic of @ngscheurich"
              />
            </a>
            <a
              className="ml-1"
              target="_blank"
              rel="noopener noreferrer"
              href="https://github.com/james-alt"
            >
              <img
                className="rounded-circle"
                src="james.jpg"
                alt="GitHub profile pic of @james-alt"
              />
            </a>

          </div>
          <div className="hidden-sm-down">
            edit this page:{" "}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://github.com/LouisianaGroups/louisiana-groups"
            >
              <i className="fab fa-github" />
            </a>
          </div>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
