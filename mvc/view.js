class ShowPosts {
  constructor (post, tags) {
    this.post = post
    this.tags = tags
  }
  static createPost (post, tags) {
    return new ShowPosts(post, tags)
  }
}

module.exports = { ShowPosts: ShowPosts }
