package com.example.demo.Service;

import com.example.demo.Constants;
import com.example.demo.Repository.SubmissionRepository;
import com.example.demo.Repository.UserProfileRepository;
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
    private UserProfileRepository userProfileRepository;
    @Autowired
    private SubmissionRepository submissionRepository;
    @Autowired
    private RestTemplate restTemplate;

    private final String CODEFORCES_API_URL = "https://codeforces.com/api/user.info?handles=";
    private final String CODEFORCES_API_URL1 = "https://codeforces.com/api/";
    private final Map<String, String> apiCache = new ConcurrentHashMap<>();


//    public UserProfile getAndSaveUserProfile(String username) throws ApiException {
//        String url = CODEFORCES_API_URL + username;
//        String response = null;
//        try {
//            // Send the GET request
//            response = restTemplate.getForObject(url, String.class);
//            System.out.println(response);
//        } catch (HttpClientErrorException e) {
//            // Capture the error response body
//            String errorResponse = e.getResponseBodyAsString();
//            // Check if the error contains "handles" indicating a user not found
//            if (errorResponse.contains("handles")) {
//                throw new ApiException("User with handle " + username + " not found", 404);
//            }
//            // If it's another error, propagate a generic error message
//            throw new ApiException("Error fetching data from Codeforces API: " + e.getMessage(), 500);
//        } catch (Exception e) {
//            // If any other exception occurs
//            throw new ApiException("An unexpected error occurred: " + e.getMessage(), 500);
//        }
//        ObjectMapper objectMapper = new ObjectMapper();
//        JsonNode rootNode = null;
//        try {
//            rootNode = objectMapper.readTree(response);
//        } catch (Exception e) {
//            throw new ApiException("Cant parse the response from api", 500);
//        }
//        if (rootNode.has("status") && rootNode.get("status").asText().equals("FAILED")) {
//            throw new ApiException("Failed to fetch the information of the given user", 404);
//        }
//        JsonNode userNode = rootNode.get("result").get(0);
//        System.out.println(userNode);
//        // Map JSON to UserProfile object
//        UserProfile userProfile = new UserProfile();
//        userProfile.setHandle(userNode.has("handle") ? userNode.get("handle").asText() : "N/A");
//        userProfile.setFirstName(userNode.has("firstName") ? userNode.get("firstName").asText() : "N/A");
//        userProfile.setLastName(userNode.has("lastName") ? userNode.get("lastName").asText() : "N/A");
//        userProfile.setCountry(userNode.has("country") ? userNode.get("country").asText() : "N/A");
//        userProfile.setCity(userNode.has("city") ? userNode.get("city").asText() : "N/A");
//        userProfile.setRating(userNode.has("rating") ? userNode.get("rating").asInt() : 0);
//        userProfile.setMaxRating(userNode.has("maxRating") ? userNode.get("maxRating").asInt() : 0);
//        userProfile.setRank(userNode.has("rank") ? userNode.get("rank").asText() : "N/A");
//        userProfile.setMaxRank(userNode.has("maxRank") ? userNode.get("maxRank").asText() : "N/A");
//        userProfile.setContribution(userNode.has("contribution") ? userNode.get("contribution").asInt() : 0);
//        userProfile.setOrganization(userNode.has("organization") ? userNode.get("organization").asText() : "N/A");
//        userProfile.setAvatar(userNode.has("avatar") ? userNode.get("avatar").asText() : "");
//        userProfile.setTitlePhoto(userNode.has("titlePhoto") ? userNode.get("titlePhoto").asText() : "");
//
//        // Save to H2 database
//        userProfileRepository.save(userProfile);
//
//        return userProfile;
//    }

//    public List<UserProfile> getAllUser() {
//        return userProfileRepository.findAll();
//    }

//    public List<Submission> getAndSaveUserSubmission(String username) throws Exception {
//        String url = CODEFORCES_API_URL1 + "user.status?handle=" + username + "&from=1&count=10";
//        String response = restTemplate.getForObject(url, String.class);
//        ObjectMapper objectMapper = new ObjectMapper();
//        JsonNode rootNode = objectMapper.readTree(response);
//        if (!rootNode.has("result") || rootNode.get("result").isEmpty()) {
//            throw new RuntimeException("No submissions found for user: " + username);
//        }
//        UserProfile userProfile = userProfileRepository.findByHandle(username)
//                .orElseThrow(() -> new RuntimeException("UserProfile not found for handle: " + username));
//        List<Submission> submissions = new ArrayList<>();
//        for (JsonNode submissionNode : rootNode.get("result")) {
//            Submission submission = new Submission();
//            submission.setHandle(username);
//            submission.setSubmissionId(String.valueOf(submissionNode.has("id") ? submissionNode.get("id").asLong() : 0));
//            submission.setProblemName(submissionNode.has("problem") ? submissionNode.get("problem").get("name").asText() : "N/A");
//            int problemRating = submissionNode.has("problem") && submissionNode.get("problem").has("rating")
//                    ? submissionNode.get("problem").get("rating").asInt()
//                    : 0;
//            submission.setProblemRating(problemRating);
//            submission.setVerdict(submissionNode.has("verdict") ? submissionNode.get("verdict").asText() : "N/A");
//            submission.setProgrammingLanguage(submissionNode.has("programmingLanguage") ? submissionNode.get("programmingLanguage").asText() : "N/A");
//            submission.setTimeConsumedMillis(submissionNode.has("timeConsumedMillis") ? submissionNode.get("timeConsumedMillis").asInt() : 0);
//            submission.setMemoryConsumedBytes(submissionNode.has("memoryConsumedBytes") ? submissionNode.get("memoryConsumedBytes").asInt() : 0);
//            submission.setUserProfile(userProfile);
//            submissions.add(submission);
//
//        }
//        submissionRepository.saveAll(submissions);
//        return submissions;
//
//    }

    public Map<String, Object> analyzeUserPerformance(String username) throws Exception {
//        List<Submission> existingSubmissions = submissionRepository.findByHandle(username);
//        if (existingSubmissions.isEmpty()) {
//            getAndSaveUserProfile(username);
//            getAndSaveUserSubmission(username);
//        }
//        List<Submission>submissions = submissionRepository.findAll();
//        if(submissions.isEmpty()){
//            throw new RuntimeException("no submission is there");
//        }



        String url = CODEFORCES_API_URL1 + "user.status?handle=" + username + "&from=1&count=7000";
        String response;
        if (apiCache.containsKey(username)) {
            System.out.println("Fetching from cache...");
            response = apiCache.get(username);
        }else{
            response = restTemplate.getForObject(url, String.class);
            apiCache.put(username, response);  // Store response in cach
        }
        JsonFactory factory = new JsonFactory();
        JsonParser parser = factory.createParser(response);
        ObjectMapper objectMapper = new ObjectMapper();
//        JsonNode rootNode = objectMapper.readTree(response);
//        if (!rootNode.has("result") || rootNode.get("result").isEmpty()) {
//            throw new RuntimeException(Constants.DEFAULT_ERROR_MESSAGE + username);
//        }
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
        Map<Integer, Integer> ratingFrequency = new HashMap<>();  // Map to store problem rating frequency
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
                    String language = submissionNode.has("programmingLanguage") ? submissionNode.get("programmingLanguage").asText() : "Unknown";
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
                            totalTime += submissionNode.has("timeConsumedMillis") ? submissionNode.get("timeConsumedMillis").asInt() : 0;
                            totalMemory += submissionNode.has("memoryConsumedBytes") ? submissionNode.get("memoryConsumedBytes").asInt() : 0;
                        } else if (verdict.equals(Constants.VERDICT_WRONG_ANSWER) || verdict.equals(Constants.VERDICT_TIME_LIMIT_EXCEEDED) || verdict.equals(Constants.VERDICT_MEMORY_LIMIT_EXCEEDED) || verdict.equals(Constants.VERDICT_RUNTIME_ERROR) || verdict.equals(Constants.VERDICT_COMPILATION_ERROR)) {
                        }

                        languageUsage.put(language, languageUsage.getOrDefault(language, 0) + 1);
                        if (rating > 0) {  // Only consider valid ratings
                            totalProblemRating += rating;
                            ratingFrequency.put(rating, ratingFrequency.getOrDefault(rating, 0) + 1);
                        }
                    }
                }
            }
        }
//        for (JsonNode submissionNode : rootNode.get("result")) {
//
//        }
        // Calculate average problem rating
        if (totalSubmissions > 0) {
            average = totalProblemRating / totalSubmissions;
        }

        // Find the most common problem rating
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
        // Final analysis map
        Map<String, Object> analysis = new HashMap<>();
        analysis.put("totalSubmissions", totalSubmissions);
        analysis.put("mostUsedLanguage", mostUsedLanguage);
        analysis.put("yourAccuracy", call2.toString());
        analysis.put("yourUseTimeNMemory", call1.toString());
        analysis.put("your average problem rating", average);
        analysis.put("mostCommonProblemRating", mostCommonProblemRating);  // Added new metric
//        analysis.put("your rating wise problem ", problemsByRating);
        analysis.put("languageUsage", languagePercentage);
        analysis.put("problems count", problemCountByRating);
        return analysis;
    }


    public Map<String, Object> analyzeContestPerformance(String username) throws Exception {
        String url = CODEFORCES_API_URL1 + "user.rating?handle=" + username;
        String response = restTemplate.getForObject(url, String.class);

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

        // Start JSON Streaming
        while (parser.nextToken() != JsonToken.END_OBJECT) {
            if ("result".equals(parser.getCurrentName())) {
                parser.nextToken(); // Move to array
                List<JsonNode> recentContests = new ArrayList<>();

                // Count total contests & store last 10 contests
                while (parser.nextToken() != JsonToken.END_ARRAY) {
                    totalContests++;
                    JsonNode contest = new ObjectMapper().readTree(parser);
                    if (totalContests > 10) {
                        recentContests.remove(0); // Remove oldest if more than 10
                    }
                    recentContests.add(contest);
                }

                // Process last 10 contests
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

        // Prepare Final Analysis
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
        CompletableFuture<String> ratingFuture = CompletableFuture.supplyAsync(() ->
                restTemplate.getForObject(CODEFORCES_API_URL1 + "user.rating?handle=" + username, String.class)
        );
        CompletableFuture<String> statusFuture = CompletableFuture.supplyAsync(() ->
                restTemplate.getForObject(CODEFORCES_API_URL1 + "user.status?handle=" + username + "&from=1&count=1000", String.class)
        );
        CompletableFuture.allOf(ratingFuture, statusFuture).join();  // Wait for both calls to complete

        String response = ratingFuture.get();
        String response1 = statusFuture.get();

        // Initialize Streaming Parser
        JsonFactory factory = new JsonFactory();

        // Parse Contest Data (user.rating)
        JsonParser parser = factory.createParser(response);
        Set<Integer> set = new HashSet<>();
        int totalContests = 0;

        while (parser.nextToken() != JsonToken.END_OBJECT) {
            if ("result".equals(parser.getCurrentName())) {
                parser.nextToken(); // Move to Array
                List<JsonNode> last10Contests = new ArrayList<>();

                // Count total contests & store last 10 contests
                while (parser.nextToken() != JsonToken.END_ARRAY) {
                    totalContests++;
                    JsonNode contest = new ObjectMapper().readTree(parser);
                    if (totalContests > 10) {
                        last10Contests.remove(0); // Remove oldest if more than 10
                    }
                    last10Contests.add(contest);
                }

                // Store Contest IDs of last 10 contests
                for (JsonNode contest : last10Contests) {
                    set.add(contest.get("contestId").asInt());
                }
            }
        }
        parser.close();

        // Parse Submission Data (user.status)
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

        // Prepare Final Analysis
        Map<String, Object> analysis = new HashMap<>();
        analysis.put("IndexCount", countOfIndex);
        return analysis;
    }
}
