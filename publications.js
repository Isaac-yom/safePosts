function publicationsApp() {
    return {
        currentUser: null,
        userPosts: [],
        searchQuery: '',
        filterPlatform: '',
        viewingPost: null,
        successMessage: '',

        init() {
        
            const savedUser = localStorage.getItem('safepost_currentUser');
            if (!savedUser) {
                window.location.href = 'index.html';
                return;
            }

            this.currentUser = JSON.parse(savedUser);
            this.loadUserPosts();
            console.log('Publications loaded for:', this.currentUser.name);
        },

        loadUserPosts() {
            const allPosts = JSON.parse(localStorage.getItem('safepost_posts') || '[]');
            this.userPosts = allPosts
                .filter(p => p.userId === this.currentUser.id)
                .sort((a, b) => new Date(b.date) - new Date(a.date)); 
            
            console.log('User posts:', this.userPosts.length);
        },

        get filteredPosts() {
            let posts = this.userPosts;

          
            if (this.filterPlatform) {
                posts = posts.filter(p => p.platform === this.filterPlatform);
            }

          
            if (this.searchQuery && this.searchQuery.trim() !== '') {         
                const query = this.searchQuery.toLowerCase();
                posts = posts.filter(p => 
                    p.text.toLowerCase().includes(query) ||
                    p.platform.toLowerCase().includes(query)            
                );
            }

            return posts;
        },

        formatDate(dateString) {
            const date = new Date(dateString);
            return date.toLocaleDateString('fr-FR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        },

        viewPost(post) {
            this.viewingPost = post;
            console.log('Viewing post:', post.id);
        },

        deletePost(postId) {
            if (!confirm('Êtes-vous sûr de vouloir supprimer cette publication ?')) {
                return;
            }

     
            const allPosts = JSON.parse(localStorage.getItem('safepost_posts') || '[]');
            const filteredPosts = allPosts.filter(p => p.id !== postId);
            localStorage.setItem('safepost_posts', JSON.stringify(filteredPosts));

        
            this.loadUserPosts();

       
            this.successMessage = '🗑️ Publication supprimée avec succès';
            setTimeout(() => this.successMessage = '', 3000);

            console.log('Post deleted:', postId);
        },
    }
} 

