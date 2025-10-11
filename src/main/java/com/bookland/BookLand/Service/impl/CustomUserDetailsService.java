package com.bookland.BookLand.Service.impl;

import com.bookland.BookLand.Exception.UserNotFoundException;
import com.bookland.BookLand.Model.User;
import com.bookland.BookLand.Repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByLoginOrEmail(username, username)
            .orElseThrow(() -> new UserNotFoundException(username));

        return org.springframework.security.core.userdetails.User
            .withUsername(user.getLogin())
            .password(user.getPassword())
            .authorities("USER")
            .build();
    }
}
