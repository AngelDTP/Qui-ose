import React, {useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import "../CSS/VisualiserOffres.css";
import EmployeurHeader from "./EmployeurHeader";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faEdit, faTrash} from '@fortawesome/free-solid-svg-icons';
import {useTranslation} from "react-i18next";

function VisualiserOffres() {
    const location = useLocation();
    const navigate = useNavigate();
    const userData = location.state?.userData;
    const employeurEmail = userData.credentials.email;
    const [offres, setOffres] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedOffre, setSelectedOffre] = useState(null);
    const [deletingId, setDeletingId] = useState(null);
    const [nbCandidats, setNbCandidats] = useState({});
    const [selectedSession, setSelectedSession] = useState(""); // État pour la session active
    const {t} = useTranslation();

    const calculateNextSession = () => {
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear() % 100; // Récupère les deux derniers chiffres de l'année
        let nextSession;

        if (currentMonth >= 8) { // Si nous sommes en septembre ou plus tard, la prochaine session est HIV de l'année suivante
            nextSession = `HIVER${currentYear + 1}`;
        } else if (currentMonth >= 4) { // Si nous sommes en mai ou plus, la prochaine session est AUT de l'année en cours
            nextSession = `AUTOMNE${currentYear}`;
        } else { // Sinon, la prochaine session est ETE de l'année en cours
            nextSession = `ETE ${currentYear}`;
        }
        console.log(nextSession);
        return nextSession;
    };

    useEffect(() => {
        setSelectedSession(calculateNextSession());
    }, []);

    useEffect(() => {
        const fetchOffresAndUtilisateurs = async () => {
            if (!employeurEmail) {
                setError("Email employeur non fourni");
                setIsLoading(false);
                return;
            }

            try {
                const response = await fetch(`http://localhost:8081/offreDeStage/offresEmployeur/${employeurEmail}`);
                if (response.status === 404) {
                    setOffres([]);
                    setIsLoading(false);
                    return;
                }

                const offresData = await response.json();
                const offresWithUtilisateurs = await Promise.all(
                    offresData.map(async (offre) => {
                        const [etudiantsResponse, entrevueResponse] = await Promise.all([
                            fetch(`http://localhost:8081/offreDeStage/${offre.id}/etudiants`),
                            fetch(`http://localhost:8081/entrevues/offre/${offre.id}`)
                        ]);

                        if (!etudiantsResponse.ok) {
                            throw new Error("Erreur dans la réponse du serveur");
                        }

                        const etudiantsData = await etudiantsResponse.json();
                        const entrevueData = entrevueResponse.ok ? await entrevueResponse.json() : [];
                        const etudiantsAvecEntrevueSet = new Set(entrevueData.map(entrevue => entrevue.etudiantDTO.credentials.email));

                        const filteredEtudiants = etudiantsData.filter((etudiant) => {
                            if (etudiantsAvecEntrevueSet.has(etudiant.credentials.email)) {
                                let entrevueEtudiant = null;
                                entrevueData.forEach((entrevue) => {
                                    if (entrevue.etudiantDTO.credentials.email === etudiant.credentials.email) {
                                        entrevueEtudiant = entrevue;
                                    }
                                });

                                if (entrevueEtudiant.status === "refuser" || entrevueEtudiant.status === "accepter") {
                                    return false;
                                } else {
                                    return true;
                                }
                            } else {
                                return true;
                            }
                        });

                        return {offre, data: filteredEtudiants};
                    })
                );

                const sortedOffres = offresWithUtilisateurs.sort((a, b) => b.data.length - a.data.length);
                setOffres(sortedOffres.map(item => item.offre));
                setNbCandidats(sortedOffres.map(item => item.data.length));
            } catch (error) {
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchOffresAndUtilisateurs();
    }, [employeurEmail]);

    const handleSessionChange = (event) => {
        setSelectedSession(event.target.value);
    };

    const filteredOffres = offres.filter(offre => {
        if (!selectedSession) return true;
        return offre.session === selectedSession;
    });

    const getNbCandidats = (offre) => {
        return nbCandidats[offres.findIndex(item => item.id === offre.id)];
    };


    const separerDate = (date) => {
        // Réinitialiser les tableaux à chaque appel
        let annee = [];
        let saison = [];

        // Séparer l'année et la saison
        for (let i = 0; i < date.length; i++) {
            if (!isNaN(date[i])) {
                annee.push(date[i]);
            } else {
                saison.push(date[i]);
            }
        }

        // Mettre à jour les états (ou tout autre affichage nécessaire)
        return {annee: annee.join(''), saison: saison.join('')};
    };

    const getStatusClass = (status) => {
        switch (status) {
            case "Validé":
                return "status-green";
            case "Rejeté":
                return "status-red";
            default:
                return "status-yellow";
        }
    };

    const handleOffreClick = (index) => {
        if (selectedOffre === index) {
            setSelectedOffre(null);
        } else {
            setSelectedOffre(index);
        }
    };

    const openPDF = (data) => {
        const pdfWindow = window.open();
        pdfWindow.document.write(
            `<iframe src="${data}" style="border:0; top:0; left:0; bottom:0; right:0; width:100%; height:100%;" allowfullscreen></iframe>`
        );
    };


    const deleteOffre = async (id) => {
        const confirmDelete = window.confirm("Voulez-vous vraiment supprimer cette offre ?");
        if (confirmDelete) {
            setDeletingId(id);
            try {
                const response = await fetch(`http://localhost:8081/offreDeStage/${id}`, {
                    method: "DELETE",
                });
                if (response.status === 204) {
                    setOffres(offres.filter((offre) => offre.id !== id));
                    setSelectedOffre(null);
                } else {
                    setError("Erreur lors de la suppression de l'offre");
                }
            } catch (error) {
                setError("Erreur lors de la suppression de l'offre");
            } finally {
                setDeletingId(null);
            }
        }
    };

    const handleUpdateClick = (offre, employeurEmail) => {
        navigate("/update-offre", {state: {offre, employeurEmail, userData}});
    };

    const handleListeClick = (offre) => {
        navigate(`/offre/${offre.id}/etudiants`, {state: {userData, offre}});
    };


    if (isLoading) {
        return <div className="text-center mt-5">
            <div className="spinner-border" role="status"></div>
            <br/>
            <span className="sr-only">{t('ChargementDesOffres')}</span>
        </div>;
    }

    if (error) {
        return <div>{t('Erreur')} {error}</div>;
    }

    return (
        <>
            <EmployeurHeader userData={userData} />
            <div className="container-fluid p-4">
                <h1 className="text-center my-1 " style={{ color: "#01579b",fontSize: "50px" }}>
                    {t('Bienvenue')}, {userData ? userData.firstName + " " + userData.lastName : ""}
                </h1>

                {/* Affichage du filtre de session si des offres existent */}
                {offres.length === 0 ? (
                       <div style={{display:'none'}}>{t('AucuneOffreTrouve')}</div>
                ) : (
                    <div className="session-filter mb-4 text-center" style={{fontSize: '1.25em'}}>
                        <label htmlFor="sessionSelect" style={{marginRight: '8px'}}>
                            {t('FilterBySession')}:
                        </label>
                        <select
                            id="sessionSelect"
                            style={{fontSize: '0.75em', padding: '0.25em ', borderRadius: '4px'}}
                            value={selectedSession}
                            onChange={handleSessionChange}
                        >
                            {Array.from(new Set(offres.map((offre) => offre.session))).map((session, index) => {
                                const sessionText = session.slice(0, -2); // Extraire la partie texte, ex : HIVER
                                const sessionYear = session.slice(-2); // Extraire l'année, ex : 25

                                // Traduire la partie texte de la session
                                const translatedSession = t(sessionText);

                                return (
                                    <option key={index} value={session}>
                                        {translatedSession} {sessionYear}
                                    </option>
                                );
                            })}
                        </select>
                    </div>
                )}

                <div className="container mt-5">
                    <h1 className="text-center mt-5" style={{fontSize:"45px"}}>{t('VosOffres')}</h1>

                    {filteredOffres.length === 0 ? (
                        <div className="alert alert-info mt-3">{t('AccuneOffreTrouve')}</div>
                    ) : (
                        <div className="row mt-3">
                            {filteredOffres.map((offre, index) => (
                                <div key={index} className="col-md-4 mb-4">
                                    <div
                                        className={`card offre-card ${deletingId === offre.id ? "fade-out" : ""}`}
                                        onClick={() => handleOffreClick(index)}
                                    >
                                        <div className="card-body">
                                            <h5 className="card-title">{offre.titre}</h5>
                                            <p className="card-text">
                                                <strong>{t('localisation')}</strong> {offre.localisation} <br />
                                                <strong>{t('NombreDeCandidatsMax')}</strong> {offre.nbCandidats}
                                                <br />
                                                <strong>{t('Session')}:</strong> {separerDate(offre.session).saison}{" "}
                                                {separerDate(offre.session).annee}
                                                <br />
                                                <br />
                                                {offre.status === "Validé" && (
                                                    <div
                                                        onClick={() => handleListeClick(offre)}
                                                        className="alert alert-link p-0 m-1 text-left text-primary text-decoration-underline"
                                                    >
                                                        {t('VoirLaListeDesCandidats')} ({getNbCandidats(offre) || 0})
                                                    </div>
                                                )}
                                            </p>
                                            <p className="info-stage">
                                                {t('DateDePublication')}{" "}
                                                {new Date(offre.datePublication).toLocaleDateString()}
                                                <br />
                                                {t('DateLimite')} {new Date(offre.dateLimite).toLocaleDateString()}
                                            </p>
                                            <div className={`status-badge ${getStatusClass(offre.status)}`}>
                                                {t('Status')} {offre.status}
                                            </div>
                                            {offre.status === "Rejeté" && (
                                                <p className="info-stage">
                                                    {t('RaisonDuRejet')}
                                                    <strong>{offre.rejetMessage}</strong>
                                                </p>
                                            )}

                                            {selectedOffre === index && (
                                                <>
                                                    <div
                                                        className="card pdf-card mt-4"
                                                        style={{ backgroundColor: "#f0f0f0" }}
                                                        onClick={() => openPDF(offre.data)}
                                                    >
                                                        <div className="card-body text-center">
                                                            <h5 className="card-title">{t('VoirLeFichierPfd')}</h5>
                                                            <p className="card-text">{t('ClickToViewPdf')}</p>
                                                        </div>
                                                    </div>
                                                    <div className="d-flex justify-content-between mt-4">
                                                        <FontAwesomeIcon
                                                            icon={faEdit}
                                                            size="2x"
                                                            className="text-warning"
                                                            style={{ cursor: "pointer" }}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleUpdateClick(offre, employeurEmail);
                                                            }}
                                                        />

                                                        <FontAwesomeIcon
                                                            icon={faTrash}
                                                            size="2x"
                                                            className="text-danger"
                                                            style={{ cursor: "pointer" }}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                deleteOffre(offre.id);
                                                            }}
                                                        />
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}


    export default VisualiserOffres;
