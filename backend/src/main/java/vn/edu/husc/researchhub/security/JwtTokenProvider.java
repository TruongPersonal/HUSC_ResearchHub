package vn.edu.husc.researchhub.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import java.security.Key;
import java.util.Date;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

@Component
public class JwtTokenProvider {

  @Value("${app.jwtSecret}")
  private String jwtSecret;

  @Value("${app.jwtExpirationInMs}")
  private int jwtExpirationDate; // Renamed from jwtExpirationInMs

  @Autowired private vn.edu.husc.researchhub.repository.UserRepository userRepository;

  public String generateToken(Authentication authentication) {
    String username = authentication.getName();
    String role =
        authentication
            .getAuthorities()
            .iterator()
            .next()
            .getAuthority(); // Get the first authority (role)

    String fullName = "";
    try {
      vn.edu.husc.researchhub.model.User user =
          userRepository.findByUsername(username).orElse(null);
      if (user != null) {
        fullName = user.getFullName();
      }
    } catch (Exception e) {
      // Ignore if user not found (should not happen)
    }

    Date currentDate = new Date();
    Date expireDate = new Date(currentDate.getTime() + jwtExpirationDate);

    return Jwts.builder()
        .setSubject(username)
        .claim("role", role)
        .claim("fullName", fullName)
        .setIssuedAt(new Date())
        .setExpiration(expireDate)
        .signWith(key())
        .compact();
  }

  private Key key() {
    return Keys.hmacShaKeyFor(Decoders.BASE64.decode(jwtSecret));
  }

  public String getUsernameFromJWT(String token) {
    return Jwts.parserBuilder()
        .setSigningKey(key())
        .build()
        .parseClaimsJws(token)
        .getBody()
        .getSubject();
  }

  public boolean validateToken(String authToken) {
    try {
      Jwts.parserBuilder().setSigningKey(key()).build().parseClaimsJws(authToken);
      return true;
    } catch (MalformedJwtException ex) {
      System.err.println("Invalid JWT token");
    } catch (ExpiredJwtException ex) {
      System.err.println("Expired JWT token");
    } catch (UnsupportedJwtException ex) {
      System.err.println("Unsupported JWT token");
    } catch (IllegalArgumentException ex) {
      System.err.println("JWT claims string is empty.");
    }
    return false;
  }
}
