package com.bookland.BookLand.Configuration;


import com.bookland.BookLand.Service.CustomUserDetailsService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
  private CustomUserDetailsService customUserDetailsService;

  public SecurityConfig(CustomUserDetailsService userDetailsService) {
    this.customUserDetailsService = userDetailsService;
  }

  @Bean
  public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http
        .authorizeHttpRequests(authorize -> authorize
            .requestMatchers(
                "/auth/login",
                "/auth/registration",
                "/auth/register",
                "/Css/Authorization/**",
                "/JavaScript/Authorization/**",
                "/Images/**",
                "/error"
            ).permitAll()
            .anyRequest().authenticated()
        )
        .formLogin(form -> form
            .loginPage("/auth/login")
            .loginProcessingUrl("/login")
            .defaultSuccessUrl("/home", true)
            .failureUrl("/auth/login?error")
            .permitAll()
        )
        .rememberMe(remember->remember
            .key("mySecretKey")
            .tokenValiditySeconds(7*24*60*60)
            .userDetailsService(customUserDetailsService)
        )
        .logout(logout -> logout
            .logoutUrl("/logout")
            .logoutSuccessUrl("/auth/login?logout")
            .invalidateHttpSession(true)
            .deleteCookies("remember-me")
            .permitAll()
        );
    return http.build();
  }

  @Bean
  public AuthenticationManager authenticationManager(HttpSecurity http, PasswordEncoder passwordEncoder, CustomUserDetailsService userDetailsService) throws Exception {
    AuthenticationManagerBuilder authenticationManagerBuilder =
        http.getSharedObject(AuthenticationManagerBuilder.class);
    authenticationManagerBuilder
        .userDetailsService(userDetailsService)
        .passwordEncoder(passwordEncoder);
    return authenticationManagerBuilder.build();
  }


  @Bean
  public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
  }
}
