    return posts.map<EnhancedPost>((post) => {
      // Rewrite image URLs through our proxy
      const file = post.file;
      const proxyFile = file?.url ? {
        ...file,
        url: file.url.replace(/https:\/\/(static\d+\.e621\.net)\//, (_, domain) => \`/img/\${domain}/\`),
      } : file;
      
      return {
        ...post,
        file: proxyFile,
        score: {
          ...post.score,
          down: Math.abs(post.score.down),
        },
        __meta: {
          isBlacklisted: isPostBlacklisted(post, args.blacklist || []),
          pageNumber: args.page,
        },
      };
    });