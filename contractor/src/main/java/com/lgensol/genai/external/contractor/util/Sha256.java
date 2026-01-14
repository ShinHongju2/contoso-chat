package com.lgensol.genai.external.contractor.util;

import java.security.MessageDigest;

public final class Sha256 {
  private Sha256() {}

  public static String hex(byte[] data) {
    try {
      MessageDigest digest = MessageDigest.getInstance("SHA-256");
      byte[] hash = digest.digest(data);
      StringBuilder sb = new StringBuilder(hash.length * 2);
      for (byte b : hash) {
        sb.append(String.format("%02x", b));
      }
      return sb.toString();
    } catch (Exception e) {
      throw new IllegalStateException("Failed to compute SHA-256", e);
    }
  }
}

