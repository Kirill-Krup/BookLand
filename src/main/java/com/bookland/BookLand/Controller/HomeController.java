package com.bookland.BookLand.Controller;

import com.bookland.BookLand.Service.UserService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequestMapping("/home")
@RestController
public class HomeController {
  private UserService userService;

  public HomeController(UserService userService) {
    this.userService = userService;
  }

}
