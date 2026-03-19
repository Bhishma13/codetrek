package com.example.demo;

import java.util.Arrays;
import java.util.List;

public class Constants {
    // API URLs
    public static final String CODEFORCES_API_URL = "https://codeforces.com/api/user.info?handles=";
    public static final String CODEFORCES_API_URL1 = "https://codeforces.com/api/";

    // Default Messages
    public static final String DEFAULT_VALUE = "N/A";
    public static final String UNKNOWN_LANGUAGE = "Unknown";
    public static final String DEFAULT_ERROR_MESSAGE = "No submissions found for user: ";

    // Performance Analysis Messages
    public static final String ANALYSIS_GOOD = "You are doing well, go with the flow";
    public static final String ANALYSIS_IMPROVE = "You should solve the problems that are rated higher for you.";

    // Submission Verdicts
    public static final String VERDICT_OK = "OK";
    public static final String VERDICT_WRONG_ANSWER = "WRONG_ANSWER";
    public static final String VERDICT_TIME_LIMIT_EXCEEDED = "TIME_LIMIT_EXCEEDED";
    public static final String VERDICT_MEMORY_LIMIT_EXCEEDED = "MEMORY_LIMIT_EXCEEDED";
    public static final String VERDICT_RUNTIME_ERROR = "RUNTIME_ERROR";
    public static final String VERDICT_COMPILATION_ERROR = "Compilation error";
    public static final List<String> VERDICT_ERRORS = Arrays.asList(
            "WRONG_ANSWER", "TIME_LIMIT_EXCEEDED", "RUNTIME_ERROR",
            "COMPILATION_ERROR", "MEMORY_LIMIT_EXCEEDED", "IDLENESS_LIMIT_EXCEEDED"
    );
}
