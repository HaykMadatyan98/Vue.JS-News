import axios from 'axios';
import { createStore } from 'vuex';

export default createStore({
    state: () => ({
        loading: false,
        error: null,
        isShowFavorites: false,

        posts: [],
        allPosts: {},
        favorits: [],

        page: 1,
        pageSize: 12,
        totalResults: 0,

        category: 0,
        categories: [
          "Business",
          "Entertainment",
          "General",
          "Health",
          "Science",
          "Sports",
          "Technology",
        ],
        language: "en",
    }),
    getters: {
        getPage(state) {
            return state.page
        },
        getFavorits(state) {
            return state.favorits
        },
        getPosts(state) {
            return state.posts
        }
    },
    mutations: {
        setLoading (state, isLoading) {
            state.loading = isLoading
        },
        setError (state, error) {
            state.error = error
        },
        setAllPosts (state, posts) {
            state.allPosts = posts
        },
        setCurrentPosts (state, posts) {
            state.posts = posts
        },
        setPage (state, page) {
            state.page = page
        },
        setCategory (state, category) {
            state.category = category
        },
        showFavorites (state, isShowFavorites) {
            state.isShowFavorites = isShowFavorites
        },
        setTotalResults (state, totalResults) {
            state.totalResults = totalResults
        },
        setFavorites (state, post) {
            state.favorits = post
        },
        addFavorites(state, post) {
            state.favorits = [...state.favorits, post].sort((a,b) => a.id[0] - b.id[0])
        },
        deleteFavorites(state, id) {
            state.favorits = (state.favorits.filter((item) => item.id !== id));
        },
    },
    actions: {
        async fetchData({state, commit}) {
            await axios
              .get('https://newsapi.org/v2/top-headlines?', {
                params: {
                    category: state.categories[state.category],
                    page: state.page,
                    pageSize: state.pageSize,
                    language: state.language,
                    apiKey: '67e83e28725a4c3fb7566013ff4fff39'
                }
              })
              .then(({ data }) => {
                const allPosts = {...state.allPosts}

                if (state.page === 1) {
                    allPosts[state.categories[state.category]] = [];
                }
                allPosts[state.categories[state.category]].push(...data.articles);
                allPosts[state.categories[state.category]].forEach(
                  (item, index) =>
                    (item.id = `${index}-${state.categories[state.category]}`)
                );

                commit('setAllPosts', allPosts)
                commit('setCurrentPosts', [...allPosts[state.categories[state.category]]])
                commit('setTotalResults', data.totalResults);
                if (data.totalResults === 0) {
                    commit('setError', 'Data not found');
                }
                commit('setLoading', false)
              })
              .catch((error) => {
                commit('setError', error)
              });
          },
    }
})