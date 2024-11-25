package com.lacouf.rsbjwt.model;

import com.lacouf.rsbjwt.model.auth.Role;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class Employeur extends UserApp{
    @Column(nullable = false, name = "ENTREPRISE")
    private String entreprise;

    public Employeur(String firstName, String lastName, String email, String password, String phoneNumber, String entreprise) {
        super(firstName, lastName, email, password, phoneNumber, Role.EMPLOYEUR);
        this.entreprise = entreprise;
    }

    @Override
    public String toString() {
        return "Employeur{" +
                "id=" + (id != null ? id : "null") +
                ", firstName='" + (firstName != null ? firstName : "null") + '\'' +
                ", lastName='" + (lastName != null ? lastName : "null") + '\'' +
                ", email='" + (getEmail() != null ? getEmail() : "null") + '\'' +
                ", phoneNumber='" + (phoneNumber != null ? phoneNumber : "null") + '\'' +
                ", role='" + (getRole() != null ? getRole() : "null") + '\'' +
                ", entreprise='" + (entreprise != null ? entreprise : "null") + '\'' +
                '}';
    }
}
