const chai = require('chai');

const { expect } = chai;

const {
  linuxSafeString,
  formatPostData,
  humanReadableMs,
} = require('../src/common-helpers');

describe('common-helpers', () => {
  describe('#linuxSafeString()', () => {
    it('replaces linux unsafe characters with _', () => {
      const somestring = 'a~b`c#d$e&f*g(h)i/j\\k|l[m]n{o}p;q\'r"s?t!v☠️w';
      const safestring = linuxSafeString(somestring);
      expect(safestring).to.eql('a_b_c_d_e_f_g_h_i_j_k_l_m_n_o_p_q_r_s_t_v_w');
    });

    it('trims consecutive underscores', () => {
      const somestring = 'a$()${}b${}c!';
      const safestring = linuxSafeString(somestring);
      expect(safestring).to.eql('a_b_c_');
    });

    it('handles faulty values as the string "undefined"', () => {
      const somestring = undefined;
      const safestring = linuxSafeString(somestring);
      expect(safestring).to.eql('undefined');
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
});
