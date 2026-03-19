package com.example.demo.Service;

import com.example.demo.Constants;
import com.fasterxml.jackson.core.JsonFactory;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonToken;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class CodeforcesService {

    @Autowired
    private RestTemplate restTemplate;

    private final String CODEFORCES_API_URL = "https://codeforces.com/api/user.info?handles=";
    private final String CODEFORCES_API_URL1 = "https://codeforces.com/api/";

    private static class CacheEntry {
        String response;
        long timestamp;

        CacheEntry(String response, long timestamp) {
            this.response = response;
            this.timestamp = timestamp;
        }
    }

    private final Map<String, CacheEntry> apiCache = new ConcurrentHashMap<>();
    private final long CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes cache expiry

    private String getFromApiOrCache(String url) {
        long now = System.currentTimeMillis();

        CacheEntry cached = apiCache.get(url);
        if (cached != null && (now - cached.timestamp < CACHE_TTL_MS)) {
            return cached.response; // Return early if cache is fresh
        }

        return apiCache.compute(url, (k, current) -> {
            // Double-check inside compute to handle concurrent threads seamlessly
            if (current != null && (System.currentTimeMillis() - current.timestamp < CACHE_TTL_MS)) {
                return current;
            }
            try {
                Thread.sleep(250); // Pause briefly to respect Codeforces rate limits
                String response = restTemplate.getForObject(k, String.class);
                return new CacheEntry(response, System.currentTimeMillis());
            } catch (Exception e) {
                throw new RuntimeException("API Call failed for " + k + " : " + e.getMessage());
            }
        }).response;
    }

    public Map<String, Object> analyzeUserPerformance(String username) throws Exception {

        String url = CODEFORCES_API_URL1 + "user.status?handle=" + username + "&from=1&count=7000";
        String response = getFromApiOrCache(url);
        JsonFactory factory = new JsonFactory();
        JsonParser parser = factory.createParser(response);
        ObjectMapper objectMapper = new ObjectMapper();
        int totalSubmissions = 0;
        int acceptedCount = 0;
        int totalTime = 0;
        int totalMemory = 0;
        int totalProblemRating = 0;
        int average = 0;
        Set<String> set = new HashSet<>();
        StringBuilder call1 = new StringBuilder();
        StringBuilder call2 = new StringBuilder();
        Map<String, Integer> languageUsage = new HashMap<>();
        Map<Integer, Integer> ratingFrequency = new HashMap<>(); // Map to store problem rating frequency
        Map<Integer, Set<String>> problemsByRating = new HashMap<>();
        Map<String, List<String>> problemAttempts = new HashMap<>();
        Map<String, Integer> problemAttemptsCount = new HashMap<>();
        Map<String, Double> languagePercentage = new HashMap<>();
        Map<String, Integer> problemCountByRating = new HashMap<>();
        while (parser.nextToken() != JsonToken.END_OBJECT) {
            if ("result".equals(parser.getCurrentName())) {
                parser.nextToken();
                while (parser.nextToken() != JsonToken.END_ARRAY) {
                    JsonNode submissionNode = objectMapper.readTree(parser);
                    totalSubmissions++;
                    String verdict = submissionNode.has("verdict") ? submissionNode.get("verdict").asText() : "N/A";
                    String language = submissionNode.has("programmingLanguage")
                            ? submissionNode.get("programmingLanguage").asText()
                            : "Unknown";
                    int rating = 0;
                    String problemName = "";
                    if (submissionNode.has("problem") && submissionNode.get("problem").has("rating")) {
                        rating = submissionNode.get("problem").get("rating").asInt();
                        problemName = submissionNode.get("problem").get("name").asText();
                    }
                    if (rating == 0) {
                        if (Objects.equals(verdict, Constants.VERDICT_OK)) {
                            if (!set.contains(problemName)) {
                                acceptedCount++;
                            }
                            set.add(problemName);

                        }
                    } else {
                        problemsByRating.putIfAbsent(rating, new HashSet<>());
                        problemsByRating.get(rating).add(problemName);
                        problemAttempts.putIfAbsent(problemName, new ArrayList<>());
                        problemAttempts.get(problemName).add(verdict);
                        if (Objects.equals(verdict, Constants.VERDICT_OK)) {
                            if (!set.contains(problemName)) {
                                acceptedCount++;
                            }
                            set.add(problemName);
                            totalTime += submissionNode.has("timeConsumedMillis")
                                    ? submissionNode.get("timeConsumedMillis").asInt()
                                    : 0;
                            totalMemory += submissionNode.has("memoryConsumedBytes")
                                    ? submissionNode.get("memoryConsumedBytes").asInt()
                                    : 0;
                        } else if (verdict.equals(Constants.VERDICT_WRONG_ANSWER)
                                || verdict.equals(Constants.VERDICT_TIME_LIMIT_EXCEEDED)
                                || verdict.equals(Constants.VERDICT_MEMORY_LIMIT_EXCEEDED)
                                || verdict.equals(Constants.VERDICT_RUNTIME_ERROR)
                                || verdict.equals(Constants.VERDICT_COMPILATION_ERROR)) {
                        }

                        languageUsage.put(language, languageUsage.getOrDefault(language, 0) + 1);
                        if (rating > 0) { // Only consider valid ratings
                            totalProblemRating += rating;
                            ratingFrequency.put(rating, ratingFrequency.getOrDefault(rating, 0) + 1);
                        }
                    }
                }
            }
        }
        if (totalSubmissions > 0) {
            average = totalProblemRating / totalSubmissions;
        }

        int mostCommonProblemRating = ratingFrequency.entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse(0); // Default to 0 if no ratings are found

        if (acceptedCount > 0) {
            int averageTime = totalTime / acceptedCount;
            int averageMemory = totalMemory / acceptedCount;
            call1.append("\nAverage time per accepted submission: ").append(averageTime).append(" ms");
            call1.append("\nAverage memory per accepted submission: ").append(averageMemory).append(" bytes");
            int accuracy = acceptedCount * 100 / totalSubmissions;
            call2.append("\nYour accuracy is: ").append(accuracy).append("%");
        }
        String mostUsedLanguage = languageUsage.entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse("Unknown");
        for (Map.Entry<String, Integer> entry : languageUsage.entrySet()) {
            double percentage = (entry.getValue() * 100.0) / totalSubmissions;
            languagePercentage.put(entry.getKey(), percentage);
        }
        for (Map.Entry<Integer, Set<String>> entry : problemsByRating.entrySet()) {
            String rating = String.valueOf(entry.getKey());
            int count = entry.getValue().size(); // Get number of problems for this rating
            problemCountByRating.put(rating, count);
        }
        Map<String, Object> analysis = new HashMap<>();
        analysis.put("totalSubmissions", totalSubmissions);
        analysis.put("mostUsedLanguage", mostUsedLanguage);
        analysis.put("yourAccuracy", call2.toString());
        analysis.put("yourUseTimeNMemory", call1.toString());
        analysis.put("your average problem rating", average);
        analysis.put("mostCommonProblemRating", mostCommonProblemRating); // Added new metric
        analysis.put("languageUsage", languagePercentage);
        analysis.put("problems count", problemCountByRating);
        return analysis;
    }

    public Map<String, Object> analyzeContestPerformance(String username) throws Exception {
        String url = CODEFORCES_API_URL1 + "user.rating?handle=" + username;
        String response = getFromApiOrCache(url);

        JsonFactory factory = new JsonFactory();
        JsonParser parser = factory.createParser(response);

        int maxIncrease = Integer.MIN_VALUE;
        int maxDrop = Integer.MAX_VALUE;
        int bestRank = Integer.MAX_VALUE;
        int worstRank = Integer.MIN_VALUE;

        List<Integer> listA = new ArrayList<>();
        List<Integer> ranking = new ArrayList<>();

        int totalContests = 0;
        int oldRating = 0, newRating = 0, rank = 0;
        int contestCount = 0;
        int startIndex = 0;

        while (parser.nextToken() != JsonToken.END_OBJECT) {
            if ("result".equals(parser.getCurrentName())) {
                parser.nextToken(); // Move to array
                List<JsonNode> recentContests = new ArrayList<>();

                while (parser.nextToken() != JsonToken.END_ARRAY) {
                    totalContests++;
                    JsonNode contest = new ObjectMapper().readTree(parser);
                    if (totalContests > 10) {
                        recentContests.remove(0); // Remove oldest if more than 10
                    }
                    recentContests.add(contest);
                }

                for (JsonNode contest : recentContests) {
                    oldRating = contest.get("oldRating").asInt();
                    newRating = contest.get("newRating").asInt();
                    rank = contest.get("rank").asInt();
                    listA.add(newRating);
                    ranking.add(rank);

                    maxIncrease = Math.max(maxIncrease, newRating - oldRating);
                    maxDrop = Math.min(maxDrop, newRating - oldRating);
                    bestRank = Math.min(bestRank, rank);
                    worstRank = Math.max(worstRank, rank);
                }
            }
        }
        parser.close();

        if (maxDrop > 0) {
            maxDrop = 0;
        }

        Map<String, Object> analysis = new HashMap<>();
        analysis.put("totalContests", totalContests);
        analysis.put("maxRatingIncrease", maxIncrease);
        analysis.put("maxRatingDrop", maxDrop);
        analysis.put("bestRank", bestRank);
        analysis.put("worstRank", worstRank);
        analysis.put("ratings", listA);
        analysis.put("rank", ranking);

        return analysis;
    }

    public Map<String, Object> IndexPerformance(String username) throws Exception {
        CompletableFuture<String> ratingFuture = CompletableFuture
                .supplyAsync(() -> getFromApiOrCache(CODEFORCES_API_URL1 + "user.rating?handle=" + username));
        CompletableFuture<String> statusFuture = CompletableFuture.supplyAsync(
                () -> getFromApiOrCache(CODEFORCES_API_URL1 + "user.status?handle=" + username + "&from=1&count=7000") // Use
                                                                                                                       // 7000
                                                                                                                       // to
                                                                                                                       // match
                                                                                                                       // cache
                                                                                                                       // key
        );
        CompletableFuture.allOf(ratingFuture, statusFuture).join(); // Wait for both calls to complete

        String response = ratingFuture.get();
        String response1 = statusFuture.get();

        JsonFactory factory = new JsonFactory();

        JsonParser parser = factory.createParser(response);
        Set<Integer> set = new HashSet<>();
        int totalContests = 0;

        while (parser.nextToken() != JsonToken.END_OBJECT) {
            if ("result".equals(parser.getCurrentName())) {
                parser.nextToken(); // Move to Array
                List<JsonNode> last10Contests = new ArrayList<>();

                while (parser.nextToken() != JsonToken.END_ARRAY) {
                    totalContests++;
                    JsonNode contest = new ObjectMapper().readTree(parser);
                    if (totalContests > 10) {
                        last10Contests.remove(0); // Remove oldest if more than 10
                    }
                    last10Contests.add(contest);
                }

                for (JsonNode contest : last10Contests) {
                    set.add(contest.get("contestId").asInt());
                }
            }
        }
        parser.close();

        parser = factory.createParser(response1);
        Map<String, Integer> countOfIndex = new HashMap<>();

        while (parser.nextToken() != JsonToken.END_OBJECT) {
            if ("result".equals(parser.getCurrentName())) {
                parser.nextToken(); // Move to Array

                while (parser.nextToken() != JsonToken.END_ARRAY) {
                    JsonNode submissionNode = new ObjectMapper().readTree(parser);

                    String index = submissionNode.has("problem") && submissionNode.get("problem").has("index")
                            ? submissionNode.get("problem").get("index").asText()
                            : "";

                    int conId = submissionNode.has("problem") && submissionNode.get("problem").has("contestId")
                            ? submissionNode.get("problem").get("contestId").asInt()
                            : 0;

                    String verdict = submissionNode.has("verdict") ? submissionNode.get("verdict").asText() : "N/A";

                    if (set.contains(conId) && Constants.VERDICT_OK.equals(verdict)) {
                        countOfIndex.put(index, countOfIndex.getOrDefault(index, 0) + 1);
                    }
                }
            }
        }
        parser.close();

        Map<String, Object> analysis = new HashMap<>();
        analysis.put("IndexCount", countOfIndex);
        return analysis;
    }
}
