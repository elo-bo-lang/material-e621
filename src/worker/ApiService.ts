import type {
  ITagsListArgs,
  IPoolsArgs,
  Post,
  IPostsListArgs,
  IPostFavoriteArgs,
  IGetPoolArgs} from "./api";
import {
  e621,
  custom
} from "./api";
import { isPostBlacklisted } from "./blacklist";
import type { BlacklistMode } from "@/services/types";
import { createTagQuery } from "@/misc/util/createTagQuery";
import { debug } from "@/misc/util/debug";

// debug.disable();
// debug.enable("app:*");

const log = debug("app:ApiService");

export interface EnhancedPost extends Post {
  __meta: {
    isBlacklisted: boolean;
    isFavoriteLoading?: boolean;
    pageNumber: number;
  };
}

export class ApiService {
  async getPosts(args: {
    page: number;
    limit: number;
    tags: string[];
    blacklist?: string[][];
    blacklistMode: BlacklistMode;
    auth?: IPostsListArgs["auth"];
    baseUrl: string;
  }) {
    log(args);
    const posts = (
      await e621.posts.list({
        ...args,
        tags: createTagQuery(
          args.blacklistMode,
          args.blacklist || [],
          args.tags,
        ),
        baseUrl: args.baseUrl
      })
    ).posts;

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
  }

  async getTags(args: ITagsListArgs) {
    const data = await e621.tags.list(args);
    if (Array.isArray(data)) {
      return data;
    } else {
      return data.tags;
    }
  }

  async getPools(args: IPoolsArgs) {
    return (await e621.pools.list(args));
  }

  async getPool(args: IGetPoolArgs) {
    return (await e621.pools.get(args));
  }

  async favoritePost(args: IPostFavoriteArgs) {
    try {
      await custom.posts.favorite(args);
      return true;
    } catch (error: any) {
      const message = error?.response?.data?.message;
      if (message) {
        throw new Error(message);
      }
      throw error;
    }
  }

  async unfavoritePost(args: IPostFavoriteArgs) {
    try {
      await custom.posts.unfavorite(args);
      return true;
    } catch (error: any) {
      const message = error?.response?.data?.message;
      if (message) {
        throw new Error(message);
      }
      throw error;
    }
  }
}
