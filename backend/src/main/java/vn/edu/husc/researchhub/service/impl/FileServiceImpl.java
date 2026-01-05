package vn.edu.husc.researchhub.service.impl;

import java.io.IOException;
import java.net.URI;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import vn.edu.husc.researchhub.service.FileService;

@Service
public class FileServiceImpl implements FileService {

    private final S3Client s3Client;

    @Value("${app.s3.bucket}")
    private String bucketName;

    @Value("${app.s3.endpoint}")
    private String endpoint;

    public FileServiceImpl(
            @Value("${app.s3.endpoint}") String endpoint,
            @Value("${app.s3.region}") String region,
            @Value("${app.s3.accessKey}") String accessKey,
            @Value("${app.s3.secretKey}") String secretKey) {

        this.s3Client = S3Client.builder()
                .endpointOverride(URI.create(endpoint))
                .region(Region.of(region))
                .serviceConfiguration(software.amazon.awssdk.services.s3.S3Configuration.builder()
                        .pathStyleAccessEnabled(true)
                        .build())
                .credentialsProvider(StaticCredentialsProvider.create(
                        AwsBasicCredentials.create(accessKey, secretKey)))
                .build();
    }

    @Override
    public String storeFile(MultipartFile file, String subDir) {
        String originalFileName = StringUtils.cleanPath(file.getOriginalFilename());
        String fileExtension = "";
        int lastDotIndex = originalFileName.lastIndexOf(".");
        if (lastDotIndex > 0) {
            fileExtension = originalFileName.substring(lastDotIndex);
        }
        String fileName = UUID.randomUUID().toString() + fileExtension;

        // Construct object key (path in bucket)
        String key = (subDir != null && !subDir.isEmpty()) ? subDir + "/" + fileName : fileName;

        System.out.println("--- DEBUG S3 UPLOAD ---");
        System.out.println("Target Bucket: " + bucketName);
        System.out.println("Endpoint: " + endpoint);
        System.out.println("Key: " + key);
        System.out.println("-----------------------");

        try {
            PutObjectRequest putOb = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(key)
                    .contentType(file.getContentType())
                    // ACL public-read is often required for direct access, check Supabase policy
                    // .acl(ObjectCannedACL.PUBLIC_READ) 
                    .build();

            s3Client.putObject(putOb, RequestBody.fromInputStream(file.getInputStream(), file.getSize()));

            // Return the relative path or full URL depending on frontend expectation.
            // Current frontend expects a path segment, usually relative. 
            // However, Supabase files are accessed via public URL.
            // Strategy: Return the path that the Frontend can construct full URL from, 
            // OR change getAvatarUrl in frontend to handle full URLs.
            // The frontend getAvatarUrl handles "http" prefix.
            // So we can return the Full Public URL here.
            
            return constructPublicUrl(key);

        } catch (IOException e) {
            throw new RuntimeException("Failed to upload file to Supabase", e);
        }
    }
    
    // Construct public URL for Supabase
    // Format: <endpoint>/object/public/<bucket>/<key>
    private String constructPublicUrl(String key) {
        // endpoint is like: https://<project>.supabase.co/storage/v1/s3
        // We need: https://<project>.supabase.co/storage/v1/object/public/<bucket>/<key>
        // Use string manipulation to adjust endpoint or user specified public URL.
        // Simplify: Assume endpoint is the S3 endpoint. 
        // Supabase public URL is slightly different from S3 endpoint.
        // Let's rely on a helper or just return the key and let frontend handle?
        // NO, frontend expects a path it can load.  
        
        // Supabase S3 Endpoint: https://<project>.supabase.co/storage/v1/s3
        // Public Access URL: https://<project>.supabase.co/storage/v1/object/public/<bucket>/<key>
        
        String publicEndpoint = endpoint.replace("/s3", "/object/public");
        return publicEndpoint + "/" + bucketName + "/" + key;
    }
}
