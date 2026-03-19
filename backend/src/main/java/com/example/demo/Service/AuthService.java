package com.example.demo.Service;

import com.example.demo.Model.UserAccount;
import com.example.demo.Repository.UserAccountRepository;
import org.mindrot.jbcrypt.BCrypt;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UserAccountRepository repository;

    public UserAccount registerUser(String username, String password, String linkedHandle) {
        if (repository.findByUsername(username).isPresent()) {
            throw new RuntimeException("Username already exists.");
        }
        UserAccount account = new UserAccount();
        account.setUsername(username);
        account.setPassword(BCrypt.hashpw(password, BCrypt.gensalt()));
        account.setLinkedHandle(linkedHandle);
        return repository.save(account);
    }

    public UserAccount loginUser(String username, String password) {
        Optional<UserAccount> opt = repository.findByUsername(username);
        if (opt.isEmpty()) {
            throw new RuntimeException("Invalid username or password.");
        }
        UserAccount account = opt.get();
        if (!BCrypt.checkpw(password, account.getPassword())) {
            throw new RuntimeException("Invalid username or password.");
        }
        return account;
    }
}
