package com.ruvaa.backend.dto;

import lombok.Data;

@Data
public class AssistRequest {
    private Long userId;
    private Long missionId;
    private String question;
    private Context context;

    @Data
    public static class Context {
        private String currentFile;
        private String fileContent;
        private int cursorLine;
        private String programmingLanguage;
        private String selectedCode;
    }
}
