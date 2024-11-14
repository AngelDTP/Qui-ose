import React, {useEffect, useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Link} from 'react-router-dom';
import {FaEnvelope, FaPhone} from 'react-icons/fa';
import {useTranslation} from 'react-i18next';
import GestionnaireHeader from "./GestionnaireHeader";
import '../CSS/ListeEtudiants.css';

function ListeEmployeurs() {
    const {t} = useTranslation();
    const [employeurs, setEmployeurs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [offres, setOffres] = useState([]);
    const [error, setError] = useState(null);
    const [selectedSession, setSelectedSession] = useState(""); // État pour la session active

    const calculateNextSessions = () => {
        const currentDates = new Date();
        const currentMonths = currentDates.getMonth();
        const currentYears = currentDates.getFullYear() % 100; // Récupère les deux derniers chiffres de l'année
        let nextSessions;

        if (currentMonths >= 8) {
            nextSessions = `HIVER${currentYears + 1}`;
        } else if (currentMonths >= 4) {
            nextSessions = `AUTOMNE${currentYears}`;
        } else {
            nextSessions = `ETE ${currentYears}`;
        }
        console.log(nextSessions);
        return nextSessions;
    };


    useEffect(() => {
        setSelectedSession(calculateNextSessions());
    }, []);

    useEffect(() => {
        fetch('http://localhost:8081/offreDeStage/all', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then(response => {
                if (!response.ok) {
                    console.log(response);
                    throw new Error('lors de la récupération des données');
                }
                return response.json();
            })
            .then(data => {
                console.log(data);
                setEmployeurs(data);
                setLoading(false);
            })
            .catch(error => {
                setError(error.message);
                setLoading(false);
            });
    }, []);

    const handleSessionChange = (event) => {
        setSelectedSession(event.target.value);
    };

    const employeursFiltres = employeurs.filter(employeur => employeur.session === selectedSession);


    if (loading) {
        return <div className="text-center mt-5">
            <div className="spinner-border" role="status"></div>
            <br/>
            <span className="sr-only">{t('chargementEmployeurs')}</span>
        </div>;
    }

    if (error) {
        return <p className="text-center mt-5 text-danger">Erreur: {error}</p>;
    }

    return (
        <>
            <GestionnaireHeader/>
            <label htmlFor="session" >{t('FilterBySession')}</label>
            <select
                id="session"
                style={{fontSize: '1.25em', padding: '0.5em 1em', borderRadius: '4px', margin: '1em'}}
                value={selectedSession}
                onChange={handleSessionChange}
            >
                {Array.from(new Set(employeurs.map(offre => offre.session))).map((session, index) => (
                    <option key={index} value={session}>{session}</option>
                ))}


            </select>
            <div className="container-fluid p-4">
                <div className="container flex-grow-1 pt-5 mt-5">
                    <h1 className="mb-4 text-center">{t('employerListTitle')}</h1>

                    {employeursFiltres.length === 0 ? (
                        <p className="text-center mt-5">{t('AucunEmployeurTrouve')}</p>
                    ) : (
                        <p className="text-center mb-4">{t('employerListSubtitle')}</p>
                    )}

                    <div className="row">
                        {employeursFiltres.map((offreDeStage) => {
                            const status = offreDeStage ? offreDeStage.status : null;
                            return (
                                <div className="col-12 col-md-6 col-lg-4 mb-4" key={offreDeStage.id}>
                                    <Link
                                        to={`/detailsEmployeur/${offreDeStage.employeur.email}/${offreDeStage.id}`}
                                        className="text-decoration-none"
                                        state={{offre: offreDeStage}}>

                                        <div
                                            className={`card shadow w-100 ${status ? status.toLowerCase() : 'sans-cv'}`}>
                                            <div className="card-body">
                                                <h5 className="card-title">{offreDeStage.employeur.entreprise + " - " + offreDeStage.titre}</h5>
                                                <p className="card-text">
                                                    <FaEnvelope/> {offreDeStage.employeur.credentials?.email}
                                                    <br/>
                                                    <FaPhone/> {offreDeStage.employeur.phoneNumber}
                                                    <br/>
                                                    <span
                                                        className="badge bg-primary">{offreDeStage.localisation}</span>
                                                </p>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </>
    );
}

export default ListeEmployeurs;