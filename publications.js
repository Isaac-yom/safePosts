function publicationsApp() {
    return {
        userPosts: [],
        searchQuery: '',
        filterPlatform: '',
        viewingPost: null,
        successMessage: '',

        init() {
            this.loadUserPosts();
            console.log('Publications app initialized');
        },

        loadUserPosts() {
            const allPosts = JSON.parse(
                localStorage.getItem('safepost_posts') || '[]'
            );

            this.userPosts = allPosts.sort(
                (a, b) => new Date(b.date) - new Date(a.date)
            );

            console.log('Total posts:', this.userPosts.length);
        },

        get filteredPosts() {
            let posts = this.userPosts;

            if (this.filterPlatform) {
                posts = posts.filter(
                    p => p.platform === this.filterPlatform
                );
            }

            if (this.searchQuery.trim() !== '') {
                const query = this.searchQuery.toLowerCase();

                posts = posts.filter(p =>
                    p.text.toLowerCase().includes(query) ||
                    p.platform.toLowerCase().includes(query)
                );
            }

            return posts;
        },

        formatDate(dateString) {
            return new Date(dateString).toLocaleDateString('fr-FR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        },

        viewPost(post) {
            this.viewingPost = post;
        },

        deletePost(postId) {
            if (!confirm('Supprimer cette publication ?')) return;

            const allPosts = JSON.parse(
                localStorage.getItem('safepost_posts') || '[]'
            );

            const updatedPosts = allPosts.filter(p => p.id !== postId);
            localStorage.setItem(
                'safepost_posts',
                JSON.stringify(updatedPosts)
            );

            this.loadUserPosts();

            this.successMessage = 'Publication supprimée';
            setTimeout(() => this.successMessage = '', 3000);
        }
    }
}



