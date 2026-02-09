function dashboardApp() {
    return {
        userPosts: [],
        newPost: {
            platform: 'facebook',
            text: '',
            images: [],
            video: null
        },
        successMessage: '',

        init() {
            this.loadUserPosts();
            console.log('Dashboard loaded (no login system)');
        },

        loadUserPosts() {
            const allPosts = JSON.parse(
                localStorage.getItem('safepost_posts') || '[]'
            );
            this.userPosts = allPosts;
            console.log('Posts loaded:', this.userPosts.length);
        },

        handleImageSelect(event) {
            const files = event.target.files;
            console.log('Images selected:', files.length);

            Array.from(files).forEach(file => {
                if (file.size > 10 * 1024 * 1024) {
                    alert(
                        'Image trop volumineuse : ' +
                        file.name +
                        ' (max 10MB)'
                    );
                    return;
                }

                const reader = new FileReader();
                reader.onload = (e) => {
                    this.newPost.images.push(e.target.result);
                    console.log(
                        'Image added, total:',
                        this.newPost.images.length
                    );
                };
                reader.readAsDataURL(file);
            });
        },

        handleVideoSelect(event) {
            const file = event.target.files[0];
            if (!file) return;

            console.log('Video selected:', file.name);

            if (file.size > 100 * 1024 * 1024) {
                alert(
                    "Vidéo trop volumineuse (max 100MB)."
                );
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                this.newPost.video = e.target.result;
                console.log('Video loaded');
            };
            reader.readAsDataURL(file);
        },

        removeImage(index) {
            this.newPost.images.splice(index, 1);
            console.log('Image removed');
        },

        removeVideo() {
            this.newPost.video = null;
            const input = document.getElementById('videoInput');
            if (input) input.value = '';
            console.log('Video removed');
        },

        savePost() {
            console.log('Saving post...');

            if (!this.newPost.text || this.newPost.text.trim() === '') {
                alert('Veuillez entrer le texte de votre publication');
                return;
            }

            const post = {
                id: Date.now(),
                platform: this.newPost.platform,
                text: this.newPost.text,
                images: [...this.newPost.images],
                video: this.newPost.video,
                date: new Date().toISOString()
            };

            const allPosts = JSON.parse(
                localStorage.getItem('safepost_posts') || '[]'
            );
            allPosts.push(post);
            localStorage.setItem(
                'safepost_posts',
                JSON.stringify(allPosts)
            );

            console.log('Post saved:', post);

            this.successMessage =
                'Publication sauvegardée avec succès !';

            setTimeout(() => {
                window.location.href = 'publications.html';
            }, 1000);
        },

        videoDisabledAlert() {
            alert(
                "La fonctionnalité vidéo est actuellement en cours de développement. Elle sera disponible très prochainement."
            );
        }
    };
}


