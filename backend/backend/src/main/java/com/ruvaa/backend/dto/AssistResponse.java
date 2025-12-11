package com.ruvaa.backend.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class AssistResponse {
    private String explanation;
    private String codeExample;
    private String practiceExercise;
    private int estimatedReadTime;
    private List<RelatedResource> relatedResources;

    @Data
    @Builder
    public static class RelatedResource {
        private String title;
        private String url;
    }
}
