
package com.example.demo.service.impl;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.dto.UserRequest;
import com.example.demo.exception.NotFoundException;
import com.example.demo.model.entity.Banque;
import com.example.demo.model.entity.Domaine;
import com.example.demo.model.entity.Etat;
import com.example.demo.model.entity.User;
import com.example.demo.model.enums.Role;
import com.example.demo.model.enums.Status;
import com.example.demo.repository.BanqueRepository;
import com.example.demo.repository.DocumentUserRepository;
import com.example.demo.repository.DomaineRepository;
import com.example.demo.repository.EtatRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.EmailService;
import com.example.demo.service.interfaces.UserService;
@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DomaineRepository domaineRepository;

    @Autowired
    private BanqueRepository banqueRepository;

    @Autowired
    private EtatRepository etatRepository;

    @Autowired
    private DocumentUserRepository documentUserRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Autowired
    private EmailService emailService;

    // =========================
    // GET ALL USERS
    // =========================

    @Override
    public List<User> getAllUsers() {

        return userRepository.findAll();
    }

    // =========================
    // GET USER BY ID
    // =========================

    @Override
    public User getById(Long id) {

        return userRepository.findById(id)
                .orElseThrow(() ->
                        new NotFoundException(
                                "User not found"
                        ));
    }

    // =========================
    // FIND BY EMAIL
    // =========================

    @Override
    public Optional<User> findByEmail(
            String email
    ) {

        return userRepository.findByEmail(email);
    }

    // =========================
    // CREATE USER
    // =========================

    @Override
    public User createUser(
            UserRequest request
    ) {

        User user = new User();

        // BASIC INFOS

        user.setUsername(
                request.getUsername()
        );

        user.setFullName(
                request.getFullName()
        );

        user.setEmail(
                request.getEmail()
        );

        user.setRole(
                Role.valueOf(
                        request.getRole()
                )
        );

        user.setStatus(
                Status.ACTIVE
        );

        // FIRST LOGIN

        user.setFirstLogin(true);

        user.setCreatedAt(
                LocalDateTime.now()
        );

        // PASSWORD HASH

        user.setPassword(
                passwordEncoder.encode(
                        request.getPassword()
                )
        );

        // =========================
        // BANQUES
        // =========================

        Set<Banque> banques =
                new HashSet<>();

        if (request.getBanqueIds() != null) {

            banques = new HashSet<>(
                    banqueRepository.findAllById(
                            request.getBanqueIds()
                    )
            );

            user.setBanques(banques);
        }

        // =========================
        // DOMAINES
        // =========================

        Set<Domaine> domaines =
                new HashSet<>();

        if (request.getDomaineIds() != null) {

            domaines = new HashSet<>(
                    domaineRepository.findAllById(
                            request.getDomaineIds()
                    )
            );

            for (Domaine d : domaines) {

                boolean valid =
                        banques.stream()
                                .anyMatch(
                                        b ->
                                                b.getDomaines()
                                                        .contains(d)
                                );

                if (!valid) {

                    throw new IllegalArgumentException(
                            "Domaine hors banque"
                    );
                }
            }

            user.setDomaines(domaines);
        }

        // =========================
        // ETATS
        // =========================

        if (request.getEtatIds() != null) {

            Set<Etat> etats =
                    new HashSet<>(
                            etatRepository.findAllById(
                                    request.getEtatIds()
                            )
                    );

            for (Etat e : etats) {

                boolean validDomaine =
                        domaines.contains(
                                e.getDomaine()
                        );

                boolean validBanque =
                        banques.stream()
                                .anyMatch(
                                        b ->
                                                b.getEtats()
                                                        .contains(e)
                                );

                if (!validDomaine ||
                        !validBanque) {

                    throw new IllegalArgumentException(
                            "Etat invalide pour cet utilisateur"
                    );
                }
            }

            user.setEtats(etats);
        }

        // =========================
        // SAVE USER
        // =========================

        User savedUser =
                userRepository.save(user);

        // =========================
        // SEND EMAIL
        // =========================

        emailService.sendAccountEmail(
                savedUser.getEmail(),
                savedUser.getUsername(),
                request.getPassword()
        );

        return savedUser;
    }

    // =========================
    // UPDATE USER
    // =========================

    @Override
    public User updateUser(
            Long id,
            UserRequest request
    ) {

        User user =
                userRepository.findById(id)
                        .orElseThrow(() ->
                                new NotFoundException(
                                        "User not found"
                                ));

        user.setUsername(
                request.getUsername()
        );

        user.setFullName(
                request.getFullName()
        );

        user.setEmail(
                request.getEmail()
        );

        user.setRole(
                Role.valueOf(
                        request.getRole()
                )
        );

        // PASSWORD

        if (request.getPassword() != null &&
                !request.getPassword().isEmpty()) {

            user.setPassword(
                    passwordEncoder.encode(
                            request.getPassword()
                    )
            );
        }

        // =========================
        // BANQUES
        // =========================

        Set<Banque> banques =
                new HashSet<>();

        if (request.getBanqueIds() != null) {

            banques = new HashSet<>(
                    banqueRepository.findAllById(
                            request.getBanqueIds()
                    )
            );

            user.setBanques(banques);
        }

        // =========================
        // DOMAINES
        // =========================

        Set<Domaine> domaines =
                new HashSet<>();

        if (request.getDomaineIds() != null) {

            domaines = new HashSet<>(
                    domaineRepository.findAllById(
                            request.getDomaineIds()
                    )
            );

            for (Domaine d : domaines) {

                boolean valid =
                        banques.stream()
                                .anyMatch(
                                        b ->
                                                b.getDomaines()
                                                        .contains(d)
                                );

                if (!valid) {

                    throw new IllegalArgumentException(
                            "Domaine hors banque"
                    );
                }
            }

            user.setDomaines(domaines);
        }

        // =========================
        // ETATS
        // =========================

        if (request.getEtatIds() != null) {

            Set<Etat> etats =
                    new HashSet<>(
                            etatRepository.findAllById(
                                    request.getEtatIds()
                            )
                    );

            for (Etat e : etats) {

                boolean validDomaine =
                        domaines.contains(
                                e.getDomaine()
                        );

                boolean validBanque =
                        banques.stream()
                                .anyMatch(
                                        b ->
                                                b.getEtats()
                                                        .contains(e)
                                );

                if (!validDomaine ||
                        !validBanque) {

                    throw new IllegalArgumentException(
                            "Etat invalide pour cet utilisateur"
                    );
                }
            }

            user.setEtats(etats);
        }

        return userRepository.save(user);
    }

    // =========================
    // DELETE USER
    // =========================

    @Override
    @Transactional
    public void deleteUser(Long id) {

        User user = userRepository.findById(id)
                .orElseThrow(() ->
                        new NotFoundException(
                                "User not found"
                        ));

        // ✅ DELETE DOCUMENT RELATIONS

        documentUserRepository
                .deleteByUser_Id(id);

        // ✅ CLEAR RELATIONS

        user.getBanques().clear();

        user.getDomaines().clear();

        user.getEtats().clear();

        // ✅ SAVE CLEAN USER

        userRepository.save(user);

        // ✅ DELETE USER

        userRepository.delete(user);
    }

    // =========================
    // SEARCH USERNAME
    // =========================

    @Override
    public List<User> searchByUsername(
            String username
    ) {

        return userRepository.findAll()
                .stream()
                .filter(u ->
                        u.getUsername() != null &&
                                u.getUsername()
                                        .toLowerCase()
                                        .contains(
                                                username.toLowerCase()
                                        )
                )
                .toList();
    }

    // =========================
    // FIND BY BANQUE
    // =========================

    @Override
    public List<User> findByBanqueId(
            Long banqueId
    ) {

        return userRepository.findAll()
                .stream()
                .filter(u ->
                        u.getBanques()
                                .stream()
                                .anyMatch(
                                        b ->
                                                b.getId()
                                                        .equals(
                                                                banqueId
                                                        )
                                )
                )
                .toList();
    }

    // =========================
    // FIND BY DOMAINE
    // =========================

    @Override
    public List<User> findByDomaineId(
            Long domaineId
    ) {

        return userRepository.findAll()
                .stream()
                .filter(u ->
                        u.getDomaines()
                                .stream()
                                .anyMatch(
                                        d ->
                                                d.getId()
                                                        .equals(
                                                                domaineId
                                                        )
                                )
                )
                .toList();
    }

    // =========================
    // SAVE USER
    // =========================

    @Override
    public User save(User user) {

        return userRepository.save(user);
    }

    // =========================
    // FIND BY ETAT
    // =========================

    @Override
    public List<User> findByEtatId(
            Long etatId
    ) {

        return userRepository.findAll()
                .stream()
                .filter(u ->
                        u.getEtats()
                                .stream()
                                .anyMatch(
                                        e ->
                                                e.getId()
                                                        .equals(
                                                                etatId
                                                        )
                                )
                )
                .toList();
    }
}
