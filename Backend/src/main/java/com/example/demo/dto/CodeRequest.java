package com.example.demo.dto;
public class CodeRequest {
    private String code;
    private Long domaineId;
    private String label;
    // getters setters

        public String getLabel() {
            return label;
        }

        public void setLabel(String label) {
            this.label = label;
        }
    public String getCode() {
        return code;
        
    }

    public void setCode(String code) {
        this.code = code;
    }

    public Long getDomaineId() {
        return domaineId;
    }

    public void setDomaineId(Long domaineId) {
        this.domaineId = domaineId;
    }
}
