package vn.edu.husc.researchhub.dto.response;

import java.util.List;
import lombok.Builder;
import lombok.Data;
import org.springframework.data.domain.Page;

@Data
@Builder
public class PageResponse<T> {
  private int page;
  private int size;
  private long totalElements;
  private int totalPages;
  private List<T> content;

  public static <T> PageResponse<T> of(Page<T> page) {
    return PageResponse.<T>builder()
        .page(page.getNumber())
        .size(page.getSize())
        .totalElements(page.getTotalElements())
        .totalPages(page.getTotalPages())
        .content(page.getContent())
        .build();
  }
}
