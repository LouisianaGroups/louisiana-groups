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
            <a className="ml-1" target="_blank" href="http://adamculpepper.net">
              <img
                className="rounded-circle"
                src="https://avatars0.githubusercontent.com/u/3942126?s=30"
              />
            </a>
          </div>
          <div className="hidden-sm-down">
            edit this page:{" "}
            <a
              target="_blank"
              href="https://github.com/adamculpepper/louisiana-groups"
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
