import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../CSS/AccueilGestionnaire.css';
import { useTranslation } from 'react-i18next';

import etudiantImage from '../images/Etudiant.png';
import professeurImage from '../images/Professeur.png';
import employeurImage from '../images/Employeur.png';

function AccueilGestionnaire() {
    const { t } = useTranslation();
    const [refusNotification] = useState(0);
    const location = useLocation();
    const userData = location.state?.userData;

    const sections = [
        { title: t("etudiant"), notifications: refusNotification, image: etudiantImage, link: "/listeEtudiants" },
        { title: t("prof"), notifications: 0, image: professeurImage },
        { title: t("employeur"), notifications: 0, image: employeurImage, link: "/listeEmployeurs" },
    ];

    return (
        <div className="container accueil-gestionnaire">
            <h2 className="text-center my-2 text-capitalize"
                style={{ color: "#01579b" }}>{t('Bienvenue')}, {userData ? userData.firstName + " " + userData.lastName : ""}!</h2>

            <h1>{t("Dashboard")}</h1>
            <div className="row justify-content-center">
                {sections.map((section, index) => (
                    <div className="col-lg-4 col-md-6 mb-4 d-flex flex-column align-items-center" key={index}>
                        <h2 className="section-title-outside">{section.title}</h2>
                        <Link to={section.link} className="section">
                            <h2 className="section-title-inside">{section.title}</h2>
                            {section.notifications > 0 && (
                                <div className="notification-badge">{section.notifications}</div>
                            )}
                            <img
                                className={`section-image section-image-${section.title.toLowerCase()}`}
                                src={section.image}
                                alt={section.title}
                            />
                        </Link>
                    </div>
                ))}
            </div>

            <div className="candidature-button-container mt-5">
                <Link to="/listeCandidatures" className="candidature-button">
                    {t("Voir les Candidatures")}
                </Link>
            </div>
        </div>
    );
}

export default AccueilGestionnaire;
