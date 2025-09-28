package com.bookland.BookLand.Exception;

public class CardInfoNotFoundException extends RuntimeException {

  public CardInfoNotFoundException(Long id) {
    super("Card Info with id " + id + " not found");
  }
}
