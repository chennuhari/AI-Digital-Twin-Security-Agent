package com.digitaltwin.digital_twin_backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "ports")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Port {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Integer portNumber;

    @Column(nullable = false)
    private String protocol;

    private String service;

    private String state;

    @ManyToOne
    @JoinColumn(name = "asset_id", nullable = false)
    private Asset asset;
}