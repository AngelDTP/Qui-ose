import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

function AccueilEtudiant() {
    const location = useLocation();
    const userData = location.state?.userData;

    const [showModal, setShowModal] = useState(false);
    const [file, setFile] = useState(null);
    const [fileData, setFileData] = useState("");
    const [message, setMessage] = useState("");

    // Effect to fetch student data when the component mounts or when userData changes
    useEffect(() => {
        if (userData && userData.id) {
            const url = `http://localhost:8080/etudiant/${userData.id}`;

            fetch(url)
                .then((response) => {
                    if (!response.ok) {
                        throw new Error(`Erreur lors de la requête: ${response.status}`);
                    }
                    return response.json();
                })
                .then((data) => {
                    if (data.cv) {
                        setFile(data.cv);
                        setFileData(data.cv.data);
                        console.log('Réponse du serveur:', data);
                    }
                    else{
                        alert("VEUILLEZ AJOUTER VOTRE CV");
                    }
                })
                .catch((error) => {
                    console.error('Erreur:', error);
                });
        }
    }, [userData]);

    const afficherAjoutCV = () => {
        setShowModal(true);
    };

    const fermerAffichageCV = () => {
        setShowModal(false);
        setMessage("");
    };

    // Function to handle file change
    const handleFileChange = (event) => {
        const uploadedFile = event.target.files[0];
        if (uploadedFile && uploadedFile.type === "application/pdf") {
            setFile(uploadedFile);

            // Read the file content as base64
            const reader = new FileReader();
            reader.onload = (e) => {
                setFileData(e.target.result);
            };
            reader.readAsDataURL(uploadedFile);
        } else {
            alert("Veuillez déposer un fichier PDF uniquement.");
        }
    };

    // Function to submit the file
    const handleSubmit = () => {
        if (file) {
            const donnesCV = {
                name: file.name,
                type: file.type,
                uploadDate: new Date(),
                data: fileData,
                status: "Attente",
            };

            const url = `http://localhost:8080/cv/creerCV/${userData.id}`;

            fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(donnesCV),
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error(`Erreur lors de la requête: ${response.status}`);
                    }
                    return response.json();
                })
                .then((data) => {
                    setMessage("CV envoyé avec succès !");
                    setFile(data);
                    setFileData(data.data);
                    console.log("Réponse du serveur:", data);
                })
                .catch((error) => {
                    setMessage(`Erreur lors de l'envoi: ${error.message}`);
                    console.error("Erreur:", error);
                });

            setShowModal(false);
        } else {
            alert("Veuillez d'abord charger un fichier.");
        }
    };

    // Function to open the file in a new window
    const openFile = () => {
        if (file) {
            const pdfWindow = window.open();
            pdfWindow.document.write(
                `<iframe src="${fileData}" frameborder="0" style="border:0; top:0; left:0; bottom:0; right:0; width:100%; height:100%;" allowfullscreen></iframe>`
            );
        } else {
            alert("Aucun fichier à afficher !");
        }
    };

    return (
        <div className="container-fluid p-3">
            {userData && (
                <div className="alert alert-info">
                    <h5>Bienvenue, {userData.firstName} {userData.lastName} !</h5>
                    <p>Email : {userData.credentials.email}</p>
                    <p>Rôle : {userData.role}</p>
                </div>
            )}

            <div className="d-flex justify-content-start">
                <button
                    className={`btn btn-lg rounded-pill ${file == null ? 'btn-primary' : 
                                                        file.status === 'Attente' ? 'btn-warning' : 
                                                        file.status === 'Aprouvé' ? 'btn-success' : 
                                                        file.status === 'Rejeté' ? 'btn-danger' : 'btn-primary'}`}
                    onClick={afficherAjoutCV}
                >
                    {file == null ? 'Ajouter CV' :
                        file.status === 'Attente' ? 'CV en attente' :
                            file.status === 'Aprouvé' ? 'CV Approuvé' :
                                file.status === 'Rejeté' ? 'CV Rejeté' : 'btn-primary'}
                </button>
            </div>

            {showModal && (
                <div className="modal show d-block" tabIndex="-1" role="dialog">
                    <div className="modal-dialog" role="document">
                    <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Manipuler Curriculum Vitae</h5>
                            </div>
                            <div className="modal-body">
                                <p>Déposez votre fichier PDF ci-dessous :</p>
                                <input
                                    type="file"
                                    className="form-control-file"
                                    accept="application/pdf"
                                    onChange={handleFileChange}
                                />
                                {file && (
                                    <div className="mt-3">
                                        <p className="text-success">Fichier sélectionné : {file.name}</p>
                                        <p className="text-secondary">Taille : {file.name} bytes</p>
                                        <p className="text-secondary">Type : {file.type}</p>
                                    </div>
                                )}
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={fermerAffichageCV}>
                                    Fermer
                                </button>
                                <button type="button" className="btn btn-primary" onClick={handleSubmit}>
                                    Soumettre
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {file && (
                <div className="mt-5 text-center">
                    <button className="btn btn-info" onClick={openFile}>
                        Voir le fichier PDF
                    </button>
                </div>
            )}

            {/* Display response message */}
            {message && (
                <div className="mt-3 alert alert-info text-center">
                    {message}
                </div>
            )}
        </div>
    );
}

export default AccueilEtudiant;
