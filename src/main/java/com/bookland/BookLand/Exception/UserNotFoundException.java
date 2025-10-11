package com.bookland.BookLand.Exception;

public class UserNotFoundException extends RuntimeException {

  public UserNotFoundException(Long id) {
    super("User " + id + " not found");
  }

  public UserNotFoundException(String str) {
    super("User " + str + " not found");
  }


}
