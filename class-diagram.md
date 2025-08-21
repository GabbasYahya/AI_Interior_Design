```mermaid
classDiagram
    %% ===== AUTHENTICATION & USER MANAGEMENT =====
    class User {
        +string id (UUID)
        +string email
        +string? phone
        +DateTime created_at
        +DateTime updated_at
        +AuthSession session
        +signIn(email, password)
        +signUp(email, password, metadata)
        +signOut()
        +resetPassword(email)
    }

    class Profile {
        +string id (UUID, FK to User)
        +string email
        +string? full_name
        +string? avatar_url
        +string? phone
        +PlanType plan_type
        +number credits
        +JSON preferences
        +DateTime created_at
        +DateTime updated_at
        +updateProfile(data)
        +uploadAvatar(file)
        +incrementCredits(amount)
        +decrementCredits(amount)
    }

    class PlanType {
        <<enumeration>>
        FREE
        PREMIUM
        PRO
    }

    %% ===== PROJECT MANAGEMENT =====
    class Project {
        +string id (UUID)
        +string user_id (FK)
        +string name
        +string? description
        +RoomType room_type
        +StyleType? style_preference
        +BudgetRange? budget_range
        +ProjectStatus status
        +string? thumbnail_url
        +DateTime created_at
        +DateTime updated_at
        +create(projectData)
        +update(projectData)
        +delete()
        +addPhoto(file)
        +generateAIDesign(prompt)
        +getMeasurements()
        +getPhotos()
        +getAIDesigns()
    }

    class ProjectStatus {
        <<enumeration>>
        DRAFT
        IN_PROGRESS
        COMPLETED
        ARCHIVED
    }

    class RoomType {
        <<enumeration>>
        LIVING_ROOM
        BEDROOM
        KITCHEN
        BATHROOM
        DINING_ROOM
        OFFICE
        HALLWAY
        OTHER
    }

    class StyleType {
        <<enumeration>>
        MODERN
        TRADITIONAL
        MINIMALIST
        CONTEMPORARY
        INDUSTRIAL
        SCANDINAVIAN
        BOHEMIAN
        RUSTIC
    }

    class BudgetRange {
        <<enumeration>>
        LOW
        MEDIUM
        HIGH
    }

    %% ===== ROOM MEASUREMENTS =====
    class RoomMeasurements {
        +string id (UUID)
        +string project_id (FK)
        +decimal length
        +decimal width
        +decimal height
        +JSON doors
        +JSON windows
        +JSON obstacles
        +JSON measurements_data
        +DateTime created_at
        +DateTime updated_at
        +calculateArea()
        +calculateVolume()
        +addDoor(doorData)
        +addWindow(windowData)
        +addObstacle(obstacleData)
        +validate()
    }

    class Door {
        +decimal x_position
        +decimal y_position
        +decimal width
        +decimal height
        +DoorType type
        +string orientation
    }

    class Window {
        +decimal x_position
        +decimal y_position
        +decimal width
        +decimal height
        +WindowType type
        +string orientation
    }

    class Obstacle {
        +decimal x_position
        +decimal y_position
        +decimal width
        +decimal length
        +decimal height
        +ObstacleType type
        +string description
    }

    %% ===== PHOTO MANAGEMENT =====
    class RoomPhoto {
        +string id (UUID)
        +string project_id (FK)
        +string file_path
        +string file_name
        +number? file_size
        +string? file_type
        +PhotoType photo_type
        +string? description
        +JSON metadata
        +DateTime created_at
        +upload(file)
        +delete()
        +getPublicUrl()
        +generateThumbnail()
        +extractMetadata()
    }

    class PhotoType {
        <<enumeration>>
        ORIGINAL
        AI_GENERATED
        EDITED
    }

    %% ===== STYLE QUIZ SYSTEM =====
    class StyleQuizResult {
        +string id (UUID)
        +string user_id (FK)
        +JSON quiz_responses
        +string calculated_style
        +JSON style_scores
        +JSON recommendations
        +DateTime created_at
        +calculateStyle(responses)
        +generateRecommendations()
        +getStyleBreakdown()
    }

    class QuizQuestion {
        +string id
        +string question_text
        +QuestionType type
        +JSON options
        +JSON style_weights
        +number order
    }

    class QuestionType {
        <<enumeration>>
        MULTIPLE_CHOICE
        IMAGE_SELECTION
        SLIDER
        RANKING
    }

    %% ===== AI DESIGN SYSTEM =====
    class AIDesign {
        +string id (UUID)
        +string project_id (FK)
        +string design_prompt
        +string ai_model_used
        +JSON generated_images
        +JSON design_elements
        +ProcessingStatus processing_status
        +number? generation_time
        +number? user_rating
        +DateTime created_at
        +generateDesign(prompt, options)
        +processImages()
        +extractElements()
        +saveRating(rating)
        +regenerate()
    }

    class ProcessingStatus {
        <<enumeration>>
        PENDING
        PROCESSING
        COMPLETED
        FAILED
    }

    class DesignElement {
        +string id
        +ElementType type
        +string name
        +string? description
        +string? color
        +string? material
        +decimal? price_estimate
        +JSON dimensions
        +string? product_url
    }

    class ElementType {
        <<enumeration>>
        FURNITURE
        LIGHTING
        DECORATION
        FLOORING
        WALL_TREATMENT
        TEXTILE
        PLANT
    }

    %% ===== FAVORITES SYSTEM =====
    class Favorite {
        +string id (UUID)
        +string user_id (FK)
        +FavoriteType favoritable_type
        +string favoritable_id
        +DateTime created_at
        +addFavorite(type, id)
        +removeFavorite()
        +isFavorited(userId, type, id)
    }

    class FavoriteType {
        <<enumeration>>
        PROJECT
        AI_DESIGN
        PHOTO
    }

    %% ===== PRODUCT RECOMMENDATIONS =====
    class ProductRecommendation {
        +string id (UUID)
        +string project_id (FK)
        +string? ai_design_id (FK)
        +string product_name
        +ProductCategory product_category
        +string? product_description
        +decimal? estimated_price
        +string? product_url
        +string? image_url
        +string? ai_reasoning
        +DateTime created_at
        +generateRecommendations(designElements)
        +updatePricing()
        +getAlternatives()
    }

    class ProductCategory {
        <<enumeration>>
        FURNITURE
        LIGHTING
        DECOR
        TEXTILES
        STORAGE
        ARTWORK
        PLANTS
        ACCESSORIES
    }

    %% ===== REACT COMPONENTS =====
    class AuthComponent {
        +User? user
        +boolean loading
        +AuthFormData formData
        +AuthTab activeTab
        +handleSignIn()
        +handleSignUp()
        +handlePasswordReset()
        +validateForm()
        +render()
    }

    class UserProfileComponent {
        +Profile? profile
        +boolean isEditing
        +boolean isSaving
        +ProfileFormData formData
        +handleSave()
        +handleAvatarUpload()
        +render()
    }

    class RoomPhotoUpload {
        +string projectId
        +UploadedPhoto[] uploadedPhotos
        +boolean uploading
        +number uploadProgress
        +onDrop(files)
        +deletePhoto(photo)
        +formatFileSize(bytes)
        +render()
    }

    class Dashboard {
        +Project[] projects
        +User user
        +ProjectStats stats
        +loadProjects()
        +createProject()
        +navigateToProject(id)
        +render()
    }

    %% ===== HOOKS & SERVICES =====
    class useSupabaseAuth {
        +User? user
        +Profile? profile
        +boolean loading
        +signInWithEmail(email, password)
        +signUpWithEmail(email, password, metadata)
        +signOut()
        +updateProfile(data)
        +uploadAvatar(file)
        +resetPassword(email)
    }

    class SupabaseClient {
        +string url
        +string anonKey
        +AuthClient auth
        +StorageClient storage
        +from(table)
        +rpc(function, params)
    }

    class StorageService {
        +uploadFile(bucket, path, file)
        +deleteFile(bucket, path)
        +getPublicUrl(bucket, path)
        +listFiles(bucket, folder)
    }

    class AIService {
        +generateDesign(prompt, images, style)
        +analyzeRoom(images)
        +suggestProducts(designElements)
        +calculateStyleScore(responses)
    }

    %% ===== RELATIONSHIPS =====
    User ||--|| Profile : "has one"
    Profile }|--|| PlanType : "has"
    Profile ||--o{ Project : "owns"
    Profile ||--o{ StyleQuizResult : "completes"
    Profile ||--o{ Favorite : "creates"

    Project }|--|| RoomType : "has"
    Project }|--o| StyleType : "prefers"
    Project }|--o| BudgetRange : "has"
    Project }|--|| ProjectStatus : "has"
    Project ||--o{ RoomMeasurements : "contains"
    Project ||--o{ RoomPhoto : "contains"
    Project ||--o{ AIDesign : "generates"
    Project ||--o{ ProductRecommendation : "suggests"

    RoomMeasurements ||--o{ Door : "contains"
    RoomMeasurements ||--o{ Window : "contains"
    RoomMeasurements ||--o{ Obstacle : "contains"

    RoomPhoto }|--|| PhotoType : "has"

    AIDesign }|--|| ProcessingStatus : "has"
    AIDesign ||--o{ DesignElement : "contains"
    AIDesign ||--o{ ProductRecommendation : "generates"

    DesignElement }|--|| ElementType : "is"

    ProductRecommendation }|--|| ProductCategory : "belongs to"

    Favorite }|--|| FavoriteType : "has"

    StyleQuizResult ||--o{ QuizQuestion : "answers"
    QuizQuestion }|--|| QuestionType : "has"

    %% Component relationships
    AuthComponent ..> useSupabaseAuth : "uses"
    UserProfileComponent ..> useSupabaseAuth : "uses"
    RoomPhotoUpload ..> SupabaseClient : "uses"
    Dashboard ..> useSupabaseAuth : "uses"

    useSupabaseAuth ..> SupabaseClient : "uses"
    SupabaseClient ..> StorageService : "includes"

    AIDesign ..> AIService : "processes with"
    ProductRecommendation ..> AIService : "generated by"
    StyleQuizResult ..> AIService : "calculated by"

    %% Storage relationships
    Profile --> StorageService : "avatar storage"
    RoomPhoto --> StorageService : "image storage"
    AIDesign --> StorageService : "generated images"
```
