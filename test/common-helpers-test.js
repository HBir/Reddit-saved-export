const chai = require('chai');

const { expect } = chai;

const {
  linuxSafeString,
  formatPostData,
  humanReadableMs,
  getFileExtension,
  remapHint,
} = require('../src/common-helpers');

describe('common-helpers', () => {
  describe('#linuxSafeString()', () => {
    it('replaces linux unsafe characters with _', () => {
      const someString = 'a~c#d$e&f*g(h)i/j\\k|l[m]n{o}p;s?t!v☠️w';
      const safeString = linuxSafeString(someString);
      expect(safeString).to.eql('a_c_d_e_f_g_h_i_j_k_l_m_n_o_p_s_t_v_w');
    });

    it('removes \'', () => {
      const someString = '"i\'d like` to go"';
      const safeString = linuxSafeString(someString);
      expect(safeString).to.eql('id_like_to_go');
    });

    it('trims consecutive underscores', () => {
      const someString = 'a$()${}b${}c!';
      const safeString = linuxSafeString(someString);
      expect(safeString).to.eql('a_b_c_');
    });

    it('handles faulty values as the string "undefined"', () => {
      const someString = undefined;
      const safeString = linuxSafeString(someString);
      expect(safeString).to.eql('undefined');
    });
  });

  describe('#formatPostData()', () => {
    it('creates a filename, returns url and postHint', () => {
      const mockPostData = {
        author: 'someRedditUser',
        subreddit: 'someSubreddit',
        title: 'this is a reddit post',
        url: 'http://www.example.com/some_content',
        post_hint: 'image',
      };
      const formattedData = formatPostData(mockPostData);
      expect(formattedData).to.deep.eql({
        url: 'http://www.example.com/some_content',
        postHint: 'image',
        filename: 'someRedditUser_[someSubreddit]_this_is_a_reddit_post',
      });
    });

    it('creates a filename, returns url and postHint from alternative post format', () => {
      const mockPostData = {
        author: { name: 'someRedditUser' },
        subreddit: { display_name: 'someSubreddit' },
        title: 'this is a reddit post',
        url: 'http://www.example.com/some_content',
        post_hint: 'image',
      };
      const formattedData = formatPostData(mockPostData);
      expect(formattedData).to.deep.eql({
        url: 'http://www.example.com/some_content',
        postHint: 'image',
        filename: 'someRedditUser_[someSubreddit]_this_is_a_reddit_post',
      });
    });

    it('Can format from only title and url', () => {
      const mockPostData = {
        title: 'this is a reddit post',
        url: 'http://www.example.com/some_content',
      };
      const formattedData = formatPostData(mockPostData);
      expect(formattedData).to.deep.eql({
        url: 'http://www.example.com/some_content',
        postHint: 'undefined',
        filename: 'undefined_[undefined]_this_is_a_reddit_post',
      });
    });

    it('fails if title or url is missing', () => {
      const mockPostData = {
        author: 'someAuthor',
      };
      expect(() => formatPostData(mockPostData)).to.throw('Invalid post: Missing title or url');
    });
  });

  describe('#humanReadableMs()', () => {
    it('prints readable whole seconds', () => {
      const ms = 5555;
      const readable = humanReadableMs(ms);
      expect(readable).to.eql('5 seconds');
    });

    it('prints readable whole minutes', () => {
      const ms = 120000;
      const readable = humanReadableMs(ms);
      expect(readable).to.eql('2 minutes ');
    });

    it('prints readable whole hours', () => {
      const ms = 7200000;
      const readable = humanReadableMs(ms);
      expect(readable).to.eql('2 hours ');
    });

    it('prints readable whole hours, minutes and seconds', () => {
      const ms = 7200000 + 120000 + 5555;
      const readable = humanReadableMs(ms);
      expect(readable).to.eql('2 hours 2 minutes 5 seconds');
    });
  });

  describe('#getFileExtension()', () => {
    it('gets file extension from url', () => {
      const url = 'https://i.imgur.com/sometest.some.jpg';
      const extension = getFileExtension(url);
      expect(extension).to.eql('jpg');
    });

    it('gets file extension from url with numbers', () => {
      const url = 'https://i.imgur.com/sometest.some.mp4';
      const extension = getFileExtension(url);
      expect(extension).to.eql('mp4');
    });

    it('gets no file extension if missing', () => {
      const url = 'https://i.imgur.com/sometest';
      const extension = getFileExtension(url);
      expect(extension).to.eql('');
    });
  });

  describe('#remapHint()', () => {
    it('changes undefined hint with image extension to image hint', () => {
      const postHint = 'undefined';
      const extension = 'jpg';
      const hint = remapHint(postHint, extension);
      expect(hint).to.eql('image');
    });

    it('changes undefined hint with video extension to video hint', () => {
      const postHint = 'undefined';
      const extension = 'mp4';
      const hint = remapHint(postHint, extension);
      expect(hint).to.eql('video');
    });

    it('changes link hint with video extension to video hint', () => {
      const postHint = 'link';
      const extension = 'mp4';
      const hint = remapHint(postHint, extension);
      expect(hint).to.eql('video');
    });

    it('keeps hint for missing extension', () => {
      const postHint = 'link';
      const extension = '';
      const hint = remapHint(postHint, extension);
      expect(hint).to.eql(postHint);
    });

    it('keeps hint for unknown extension', () => {
      const postHint = 'link';
      const extension = 'aaa';
      const hint = remapHint(postHint, extension);
      expect(hint).to.eql(postHint);
    });

    it('keeps hint for known hint', () => {
      const postHint = 'rich_video';
      const extension = 'aaa';
      const hint = remapHint(postHint, extension);
      expect(hint).to.eql(postHint);
    });
  });
});
